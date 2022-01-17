import CardClips from "../ui/CardClips";
import classes from "../../styles/Clips.module.css";
import {ReactComponent as CheckIcon} from '../../icons/check.svg';
import {ReactComponent as PendingIcon} from '../../icons/pending.svg';
import {useContext} from 'react';
import AppContext from '../../store/AppContext.js';

function Clips(props){
    const context = useContext(AppContext);
    let showSelected = false;
    const clipName = `${props.category} Clip ${props.id + 1}`;


    function toggleIsClicked(){
        let files;
        let generatedTranscription;
        let fixedTranscription;

        context.setCurrentId(props.id);

        if(context.selectedCategory === "agent"){

            files = context.agent_audios[props.id];           
            generatedTranscription = context.agent_original_trans[props.id]["text"];
            if(generatedTranscription === ""){generatedTranscription="This clip doesn't have any associated transcription. Please consider deleting it."}

            fixedTranscription = context.agent_fixed_trans[props.id]["text"];
            if(fixedTranscription === ""){fixedTranscription="This clip doesn't have any associated transcription. Please consider deleting it."}

        }else if(context.selectedCategory === "client"){

            files = context.client_audios[props.id];           
            generatedTranscription = context.client_original_trans[props.id]["text"];
            if(generatedTranscription === ""){generatedTranscription="This clip doesn't have any associated transcription. Please consider deleting it."}

            fixedTranscription = context.client_fixed_trans[props.id]["text"];
            if(fixedTranscription === ""){fixedTranscription="This clip doesn't have any associated transcription. Please consider deleting it."}

        }
        files.file.async("blob")
                .then(function (data){
                    context.setCurrentClip(URL.createObjectURL(data));
                    props.updateaudio();
                });
        
        context.setSelectedTranscription({"generated": generatedTranscription, "fixed": fixedTranscription});


    }
    let status;
    

    if(props.transcribed){
        status = <div className={classes.divDown}>
                    <PendingIcon fill="rgba(124, 118, 121, 0.54)" stroke="rgba(124, 118, 121, 0.54)" className={classes.icon}></PendingIcon>
                    <CheckIcon fill="rgba(8, 181, 19, 0.68)" stroke="rgba(8, 181, 19, 0.68)" ></CheckIcon>
                </div>
    }else{
        status = <div className={classes.divDown}>
                    <PendingIcon fill="rgba(234, 94, 24, 0.8)" stroke="rgba(234, 94, 24, 0.8)" className={classes.icon}></PendingIcon>
                    <CheckIcon fill="rgba(124, 118, 121, 0.54)" stroke="rgba(124, 118, 121, 0.54)" ></CheckIcon>
                </div>
    }

    if(props.id === context.currentId){
        showSelected = true;
    }
    return(
        <CardClips customClickEvent={toggleIsClicked} selected={showSelected}>
            <div className={classes.divUp}>{clipName}</div>
            {status}
        </CardClips>
    );
}

export default Clips;