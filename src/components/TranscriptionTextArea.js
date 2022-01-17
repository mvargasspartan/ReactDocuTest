import {Grid} from '@material-ui/core';
import {useContext, useState, forwardRef, useImperativeHandle, useRef} from 'react'

import AppContext from '../store/AppContext.js';
import CardTextArea from "./ui/CardTextArea";
import classes from '../styles/TranscriptionTextArea.module.css'

function TranscriptionTextArea(props, ref){
    const context = useContext(AppContext);
    const [generatedTranscription, setGeneratedTranscription] = useState(["Select a clip to start."])
    const [userTranscription, setUserTranscription] = useState(["Select a clip to start."]);
    const fixedTranscriptionTxtAreaRef = useRef();

    function TextChange(){
        setUserTranscriptionHandler(fixedTranscriptionTxtAreaRef.current.value);
        context.setFixedTranscription(fixedTranscriptionTxtAreaRef.current.value);
    }

    function setUserTranscriptionHandler(trancription){
        setUserTranscription(trancription);
    }

    useImperativeHandle(ref, () => ({

        handleTranscription(){
            setGeneratedTranscription(context.selected_transcription["generated"]);
            setUserTranscriptionHandler(context.selected_transcription["fixed"]);
            context.setFixedTranscription(context.selected_transcription["fixed"]);
            
        },
    
      }))

    return(
        <CardTextArea>
            <Grid container>
                <Grid item xs={4} >
                    <h3 className={classes.h3}>Generated Transcription</h3>
                    <textarea id="generatedTrans" rows="28" disabled className={classes.textArea} value={generatedTranscription}></textarea>
                </Grid>
                <Grid item xs={8} >
                    <h3 className={classes.h3}>Area for reviewing and fixing</h3>
                    <textarea id="userTrans" required rows="28" className={classes.textArea} value={userTranscription} ref={fixedTranscriptionTxtAreaRef} onChange={TextChange}></textarea>
                </Grid>
            </Grid>
        </CardTextArea>
    );
}

export default forwardRef(TranscriptionTextArea);