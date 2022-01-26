import { Grid, Box } from "@material-ui/core";
import { useState, useRef, useContext, useEffect} from "react";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";


import AudioPlayerWidget from "../components/AudioPlayerWidget";
import ChannelSwitch from "../components/clips/ChannelSwitch";
import FileUpload from "../components/FileUpload";
import Clips from "../components/clips/Clips";
import TranscriptionTextArea from "../components/TranscriptionTextArea";
import ControlButtons from "../components/ControlButtons";
import AppContext from '../store/AppContext.js';
import useExitPrompt from "../components/hooks/useExitPrompt";

/**
* This is the main component of the application, it will handle all the other components.
*/
function TranscriptionTool() {

  const context = useContext(AppContext);
  const data_agent = context.agent_audios;
  const data_client = context.client_audios;



  //state will handle 3 actions: start, loading, loaded.
  const [state, setState] = useState("start");
  const [clipsToDisplay, setClipsToDisplay] = useState("Agent");
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);
  const childRefAudioPlayer = useRef();
  const childRefTranscriptionTextArea = useRef();

  

  useEffect(() => {
      setShowExitPrompt(true)
  }, [setShowExitPrompt, showExitPrompt])



  function handleLoadingState(state){
      setState(state);
  }

  function handleClipClick(){
    childRefAudioPlayer.current.handleAudio();
    childRefTranscriptionTextArea.current.handleTranscription();
  }



  let selectedData = [];

  function toggleAgentClips() {
    setClipsToDisplay("Agent");
    context.setSelectedCategory("agent")
  }
  function toggleClientClips() {
    setClipsToDisplay("Client");
    context.setSelectedCategory("client")
  }

  

  if (clipsToDisplay === "Agent") {
    selectedData = data_agent;
  } else {
    selectedData = data_client;
  }

  const onLoadedContent = (
    <Grid container>
      <Grid item xs={2} style={{ height: "52rem" }}>
        <div style={{ height: "8rem" }}>
          <ChannelSwitch
            toggleAgent={toggleAgentClips}
            toggleClient={toggleClientClips}
          ></ChannelSwitch>
        </div>
        <div>
          <Box style={{ maxHeight: "40rem", overflow: "auto", margin: "1rem" }}>
            {selectedData.map((clip) => (
              <Clips key={clip.id} id={clip.id} transcribed={clip.transcribed} category={clipsToDisplay} updateAudio={handleClipClick}/>
            ))}
          </Box>
        </div>
      </Grid>

      <Grid item xs={10} style={{ height: "50rem" }}>
        <div style={{ height: "40rem" }}>
          <TranscriptionTextArea ref={childRefTranscriptionTextArea}></TranscriptionTextArea>
        </div>
        <div>
          <ControlButtons state={handleLoadingState} toggleAgent={toggleAgentClips}></ControlButtons>
        </div>
      </Grid>
    </Grid>
  );

  const override = `
    display: block;
    margin: 0 auto;
    margin-top: 8rem;
    border-color: red;
    `;

  const onLoadingContent = (
    <Grid container>
        <Grid item xs={12} style={{ height: "10rem" }}>
            <div>
                <ClimbingBoxLoader color={"#540a78"} size={25} css={override}/>
                <h3 style={{textAlign: "center", marginTop: "2rem"}}>Loading...</h3>
            </div>
        </Grid>
      </Grid>
  );

  const startContent = (
    <Grid container>
    <Grid item xs={12} style={{ height: "10rem" }}>
        <div>
            <h1 style={{color: "rgba(141, 113, 127, 0.60)", textAlign: "center", marginTop: "15rem"}}>Empty workspace. Start by uploading ONE audio file (.wav)</h1>
        </div>
    </Grid>
  </Grid>
  );

  let content;

  if(state === "loaded" | context.dataIsLoaded){
    content = onLoadedContent;
  }else if(state === "loading"){
      content = onLoadingContent;
  }else if(state === "start"){
      content = startContent;
  }


  return (
    <section>
      <Grid container>
        <Grid item xs={4} style={{ height: "10rem" }}>
          <FileUpload state={handleLoadingState} updateaudio={handleClipClick} toggleAgent={toggleAgentClips}></FileUpload>
        </Grid>
        <Grid item xs={8}>
          <Grid container>
            <Grid item xs={6}>
              <AudioPlayerWidget ref={childRefAudioPlayer} name={context.currentId === -1 ? "Clip Player: No clip selected" : `Playing clip ${context.currentId + 1}`}></AudioPlayerWidget>
            </Grid>
            <Grid item xs={6}>
              <AudioPlayerWidget completeAudio={context.completeRecording} name={"Complete audio recording"}></AudioPlayerWidget>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {content}
    </section>
  );
}

export default TranscriptionTool;
