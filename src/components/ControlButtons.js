import classes from '../styles/ControlButtons.module.css';
import PropTypes from 'prop-types';
import {Grid} from '@material-ui/core';
import { useContext, useState } from "react";
import JSZip from 'jszip';

import CardControlButtons from './ui/CardControlButtons';
import Modal from './ui/Modal';
import Backdrop from './ui/Backdrop';
import AppContext from '../store/AppContext.js';
import { saveAs } from 'file-saver';

/**
* Component for rendering all the control buttons ["Delete","Un/Mark clip as correct","Submit Transcription","Save Transcription"]
*/
function ControlButtons(props){
    ControlButtons.propTypes = {
        /** Function for changing the state of the transcription page ["start","loading","loaded"]. */
        state: PropTypes.func,
        /** Function for switching the channel category to Agent. */
        toggleAgent: PropTypes.func
        };

    const context = useContext(AppContext);
    const [ modalIsOpen, setModalIsOpen] = useState(false);
    const [ modalSubmit, setModalSubmit] = useState(false);
    const [ modalSave, setModalSave] = useState(false);
    const [ modalSubmitLoading, setModalSubmitLoading] = useState(false);
    const [ modalSubmitSuccess, setModalSubmitSuccess] = useState(false);
    const [ modalSubmitFailed, setModalSubmitFailed] = useState(false);
    const [ modalDeleteAllClips, setModalDeleteAllClips] = useState(false);
    

    function clipMark(){

        if(context.currentId !== -1){

            if(context.selectedCategory === "agent"){
                if(context.agent_audios[context.currentId]["transcribed"]){
                    context.unmarkTranscription(context.currentId);
                }else{
                    let data = [...context.agent_fixed_trans];
                    data[context.currentId]["text"] = context.fixed_transcription;
                    context.setAgentFixedTrans(data);
                    context.markTranscription(context.currentId);
                }
 
            }else if(context.selectedCategory === "client"){
                if(context.client_audios[context.currentId]["transcribed"]){
                    context.unmarkTranscription(context.currentId);
                }else{
                    let data = [...context.client_fixed_trans];
                    data[context.currentId]["text"] = context.fixed_transcription;
                    context.setClientFixedTrans(data);
                    context.markTranscription(context.currentId);
                }

            }
        }
    }

    function deleteClip(){
        if(context.currentId !== -1){
            if(context.selectedCategory === "agent"){
                if(context.agent_audios.length === 1){
                    openModalDeleteAllClips();
                }
                else{setModalIsOpen(true);}
            }
            else if(context.selectedCategory === "client"){
                if(context.client_audios.length === 1){
                    openModalDeleteAllClips();
                }
                else{setModalIsOpen(true);}
            }
        }
    }

    function confirmDeleteClip(){
        if(context.currentId !== -1){
            setModalIsOpen(false);
            context.deleteClip(context.currentId);
            context.setCurrentId(0);
        }
    }

    function closeModal(){
        setModalIsOpen(false);
    }

    function closeModalSubmit(){
        setModalSubmit(false);
    }

    function saveTranscription(){

            const amoutClips = {"agent_clips": context.workStatus["agentTotal"], "client_clips": context.workStatus["clientTotal"]};

            var zip = new JSZip();

            let counter = 0;
            context.agent_audios.forEach((audio) => {

                const data = audio.file.async("blob").then((data)=>{return data;});
                let audioStatus = audio.transcribed ? "1" : "0"; 
                zip.file(`${audioStatus}Agent:part_${counter}.wav`, data);
                counter++;
            }) 

            counter = 0;
            context.client_audios.forEach((audio) => {
                const data = audio.file.async("blob").then((data)=>{return data;});
                let audioStatus = audio.transcribed ? "1" : "0"; 
                zip.file(`${audioStatus}Client:part_${counter}.wav`, data);
                counter++;
            })

            zip.file("agentOriginal.json", JSON.stringify(context.agent_original_trans));
            zip.file("agentFixed.json", JSON.stringify(context.agent_fixed_trans));
            zip.file("clientOriginal.json", JSON.stringify(context.client_original_trans));
            zip.file("clientFixed.json", JSON.stringify(context.client_fixed_trans));
            zip.file("amout.clips.json", JSON.stringify(amoutClips));

            zip.generateAsync({type:"blob"})
            .then(function(content) {
                saveAs(content, `WIP-${context.audioName}.zip`);
            });
    }

    function submitSuccess(){
        context.setCurrentId(-1);
        context.setSelectedCategory("agent");
        setModalSubmitSuccess(true);
    }

    function submitLoadingModal(){
        setModalSubmitLoading(true);
    }

    function submitFailed(){
        setModalSubmitFailed(true);
    }

    function closeModalSave(){
        setModalSave(false);
    }

    function closeModalSubmitLoading(){
        setModalSubmitLoading(false);
    }

    function closeModalSubmitSuccess(){
        setModalSubmitSuccess(false);
        context.setDataIsLoaded(false);
        props.toggleAgent();
        props.state("start");

    }
    function closeModalSubmitFailed(){
        setModalSubmitFailed(false);
        context.setDataIsLoaded(false);
        context.setSelectedCategory("agent")
        props.state("start");
    }

    function openModalDeleteAllClips(){
        setModalDeleteAllClips(true);
    }


    function closeModalDeleteAllClips(){
        setModalDeleteAllClips(false);
    }

    function submitTranscription(){
        const clipsAgentDone = context.workStatus["agentDone"];
        const clipsAgentTotal = context.workStatus["agentTotal"];
        const clipsClientDone = context.workStatus["clientDone"];
        const clipsClientTotal = context.workStatus["clientTotal"];

        if(clipsAgentDone === clipsAgentTotal & clipsClientDone === clipsClientTotal){

            submitLoadingModal();

            let agentTranscriptions = "";
            let clientTranscriptions = "";
            
            context.agent_fixed_trans.forEach((transcription) => {
                agentTranscriptions += transcription["text"] + "\n\n"
            })

            context.client_fixed_trans.forEach((transcription) => {
                clientTranscriptions += transcription["text"] + "\n\n"
            })

            var zip = new JSZip();

            let counter = 0;
            context.agent_audios.forEach((audio) => {

                const data = audio.file.async("blob").then((data)=>{return data;});
                zip.folder(context.audioName).folder("agent").file(`part_${counter}.wav`, data);
                counter++;
            }) 

            counter = 0;
            context.client_audios.forEach((audio) => {
                const data = audio.file.async("blob").then((data)=>{return data;});
                zip.folder(context.audioName).folder("client").file(`part_${counter}.wav`, data);
                counter++;
            })

            zip.folder(context.audioName).folder("agent").file("transcription.txt", agentTranscriptions);
            zip.folder(context.audioName).folder("client").file("transcription.txt", clientTranscriptions);

            zip.generateAsync({type:"blob"})
            .then(function(content) {

                let formData = new FormData();
                formData.append('file', content);
                formData.append('fileName', context.audioName);
          
                fetch('https://spartahearing-labelingtool-be-dev-yxglfl6iiq-uk.a.run.app/upload-zip/',
                  {
                      method: "POST",
                      body: formData,
                      headers: {
                        Accept: "text/*"
                      }
                  }).then((response) => {
                      closeModalSubmitLoading();
                      submitSuccess();

                  }).catch(error => {
                    closeModalSubmitLoading();
                    submitFailed();
                    saveAs(content, `${context.audioName}.zip`);
                });


            });

        }else{
            setModalSubmit(true);
        }
    }

    let markButtonText = "Mark Clip as correct";
    
    if(context.currentId !== -1){
        if(context.selectedCategory === "agent"){
            if(context.agent_audios[context.currentId]["transcribed"]){
                markButtonText = "Unmark Clip as correct"
            }else{
                markButtonText = "Mark Clip as correct"
            }
        }else if(context.selectedCategory === "client"){
            if(context.client_audios[context.currentId]["transcribed"]){
                markButtonText = "Unmark Clip as correct"
            }else{
                markButtonText = "Mark Clip as correct"
            }
        }
    }

    return(
        <div>
        <Grid container>
            <Grid item xs={6} >
                <CardControlButtons>
                <div>
                    <h4 className={classes.center} >Clip Options</h4>
                    <div className={classes.center}>
                        <button onClick={deleteClip} className={classes.btn}>Delete Clip</button>
                        <button onClick={clipMark} className={classes.btn}>{markButtonText}</button>
                     </div>
                </div>
                </CardControlButtons>
            </Grid>
            <Grid item xs={6} >
                <CardControlButtons>
                <div>
                    <h4 className={classes.center} >Transcription Options</h4>
                    <div className={classes.center}>
                        <button onClick={submitTranscription} className={classes.btn}>Submit Transcription</button>
                        <button onClick={saveTranscription} className={classes.btn}>Save Transcription</button>
                    </div>
                </div>
                </CardControlButtons>
            </Grid>
            {modalIsOpen ? <Modal confirm={confirmDeleteClip} cancel={closeModal} line1={"Are you sure you want to delete this clip?"} line2={"This action cannot be undone."}/> : null}
            {modalIsOpen ? <Backdrop onClick={closeModal}/> : null}
            {modalSubmit ? <Modal accept={closeModalSubmit} line1={"Can't submit yet! you still have pending clips."} line2={"These may need to be transcribed or deleted."}/> : null}
            {modalSubmit ? <Backdrop onClick={closeModalSubmit}/> : null}
            {modalSave ? <Modal accept={closeModalSave} line1={"This feature is still under development."} line2={"It will allow you to save an unfinished transcription."}/> : null}
            {modalSave ? <Backdrop onClick={closeModalSave}/> : null}
            {modalSubmitLoading ? <Modal line1={"Uploading the transcription."} line2={"Please wait a moment."}/> : null}
            {modalSubmitLoading ? <Backdrop /> : null}
            {modalSubmitSuccess ? <Modal accept={closeModalSubmitSuccess} line1={"The transcription has been successfully uploaded! Thank you!"} line2={"You will return to the starting page."}/> : null}
            {modalSubmitSuccess ? <Backdrop onClick={closeModalSubmitSuccess}/> : null}
            {modalSubmitFailed ? <Modal accept={closeModalSubmitFailed} line1={"The transcription upload failed, downloading file locally."} line2={"You will return to the starting page."}/> : null}
            {modalSubmitFailed ? <Backdrop onClick={closeModalSubmitFailed}/> : null}
            {modalDeleteAllClips ? <Modal accept={closeModalDeleteAllClips} line1={"You're about to delete the last clip of this channel."} line2={"This is not an expected use."}/> : null}
            {modalDeleteAllClips ? <Backdrop onClick={closeModalDeleteAllClips}/> : null}
        </Grid>
        </div>
    );
}

export default ControlButtons;
