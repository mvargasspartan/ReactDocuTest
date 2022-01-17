import {useCallback, useMemo, useContext, useState} from 'react'
import {useDropzone} from 'react-dropzone';
import JSZip from 'jszip';


import AppContext from '../store/AppContext.js';
import Modal from './ui/Modal';
import Backdrop from './ui/Backdrop';

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: "3rem",
    margin: "2%",
    borderWidth: 2,
    borderRadius: '35px',
    borderColor: 'rgba(0, 0, 0, 1)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(159, 2, 170, 0.2)',
    color: 'rgba(0, 0, 0, 1)',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  };
  
  const activeStyle = {
    borderColor: '#2196f3'
  };
  
  const acceptStyle = {
    borderColor: '#00e676'
  };
  
  const rejectStyle = {
    borderColor: '#ff1744'
  };

function FileUpload(props){

    const context = useContext(AppContext);
    const [ modalServerFailed, setModalServerFailed] = useState(false);
    const [ modalOpenNewFile, setModalOpenNewFile] = useState(false);
    const [file, setFile] = useState({});

    function openModalOpenNewFile(){
      setModalOpenNewFile(true);
    }
    function closeModalOpenNewFile(){
      setModalOpenNewFile(false);
    }
    function confirmOpenNewFile(){
      props.state("loading");
      transcribe(file);
      props.toggleAgent();
      context.setCurrentId(-1);
      closeModalOpenNewFile();
    }
    

    const transcribe = useCallback((audio) => { 
      
      context.setAudioName(audio[0]["name"].slice(0, -4))
      
      context.setDataIsLoaded(false);
      props.state("loading");
      context.setCompleteRecording(URL.createObjectURL(audio[0]));
 
  
      let formData = new FormData();
      formData.append('file', audio[0]);
      fetch('https://spartahearing-labelingtool-be-dev-yxglfl6iiq-uk.a.run.app/transcribe-file/',
        {
            method: "POST",
            body: formData,
            headers: {
              Accept: "text/*"
            }
        }).then((response) => response.blob())
        .then(data => {

          var zip = new JSZip();
            zip.loadAsync(data).then(function(zip){

              zip.file("amout.clips.json").async("string").then(function (data){
                let amoutClips = JSON.parse(data);
                let totalAgentClips = amoutClips["agent_clips"];
                let totalClientClips = amoutClips["client_clips"];

                const status_data = {"agentDone": 0, "clientDone": 0, "agentTotal": totalAgentClips, "clientTotal": totalClientClips}
                context.setWorkStatus(status_data);

                var agent_clips = [];
                var client_clips = [];
                for (let i = 0; i < totalAgentClips; i++) {
                  agent_clips.push({"id": i, "file":zip.files[`clip_agent-part_${i}.wav`], "transcribed": false});            
                } 

                for (let i = 0; i < totalClientClips; i++) {
                  client_clips.push({"id": i, "file":zip.files[`clip_client-part_${i}.wav`], "transcribed": false});               
                } 

                context.setAgentAudios(agent_clips);
                context.setClientAudios(client_clips);
              });
              

              zip.file("transcription-agent.json").async("string").then(function (data){
                context.setAgentOriginalTrans(JSON.parse(data));
                context.setAgentFixedTrans(JSON.parse(data));
              });
              zip.file("transcription-client.json").async("string").then(function (data){
                context.setClientOriginalTrans(JSON.parse(data));
                context.setClientFixedTrans(JSON.parse(data));

                context.setDataIsLoaded(true);
                props.state("loaded");
              });  
              
              
            })
           
        })
        .catch(error => {
            props.state("start");
            setModalServerFailed(true);
        });
    
  }, [context, props]);
    
    const onDrop = useCallback(acceptedFile => {
      if(context.dataIsLoaded){
        setFile(acceptedFile);
        openModalOpenNewFile();
      }else{
        props.state("loading");
        transcribe(acceptedFile);
      }
      }, [props, transcribe, context.dataIsLoaded]);

    const {getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject} = useDropzone({onDrop, acceptedFiles: "audio/*", maxFiles:1 })

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
      }), [
        isDragActive,
        isDragReject,
        isDragAccept
      ]);

    function closeModal(){
      setModalServerFailed(false);
    }

    return(
        <div {...getRootProps({style})}>
            <input {...getInputProps()} />
                {
                isDragActive ?
                <p>Drop the files here ...</p> :
                <div>
                    <p>Drag 'n' drop a file here, or click to select it...</p>
                    <em >(Only ONE *.wav file will be accepted)</em>
                </div>
                
                }
                {modalServerFailed ? <Modal accept={closeModal} line1={"The transcriptions server failed to respond."} line2={"Please report this issue and try again later."}/> : null}
                {modalServerFailed ? <Backdrop onClick={closeModal}/> : null}
                {modalOpenNewFile ? <Modal confirm={confirmOpenNewFile} cancel={closeModalOpenNewFile} line1={"You're about to open a new file."} line2={"Are you sure you want to continue?."}/> : null}
                {modalOpenNewFile ? <Backdrop onClick={closeModalOpenNewFile}/> : null}
        </div>
    );
}

export default FileUpload;