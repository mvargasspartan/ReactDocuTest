import { createContext, useState } from "react";

const AppContext = createContext({
    audio: {},
    audioName: {},
    selectedTranscription: {},
    selectedCategory: {},
    workStatus: {},
    currentId: {},
    dataIsLoaded: {},
    completeRecording: {},
    agent_audios: [],
    client_audios: [],
    agent_original_trans: [],
    client_original_trans: [],
    agent_fixed_trans: [],
    client_fixed_trans: [],
    fixed_transcription: {},
    setCurrentClip: (audio) => {},
    setAudioName: (name) => {},
    setSelectedTranscription: (transcription) => {},
    setSelectedCategory: (category) => {},
    setWorkStatus: (transcription) => {},
    setCurrentId: (id) => {},
    setDataIsLoaded: (status) => {},
    setCompleteRecording: (audio) => {},
    setAgentAudios: (audio) => [],
    setClientAudios: (audio) => [],
    setAgentOriginalTrans: (file) => [],
    setClientOriginalTrans: (file) => [],
    setAgentFixedTrans: (file) => [],
    setClientFixedTrans: (file) => [],
    markTranscription: (id) => [],
    unmarkTranscription: (id) => [],
    deleteClip: (id) => []
});
export function AppContextProvider(props){
    const [userAudio, setUserAudio] = useState({});
    const [audioName, setAudioName] = useState({});
    const [selectedTranscription, setSelectedTranscription] = useState({});
    const [selectedCategory, setSelectedCategory] = useState("agent");
    const [workStatus, setWorkStatus] = useState({});
    const [currentId, setCurrentId] = useState(-1);
    const [dataIsLoaded, setDataIsLoaded] = useState(false);
    const [completeRecording, setCompleteRecording] = useState(-1);
    const [agentAudios, setAgentAudios] = useState([]);
    const [clientAudios, setClientAudios] = useState([]);
    const [agentOriginalTrans, setAgentOriginalTrans] = useState([]);
    const [clientOriginalTrans, setClientOriginalTrans] = useState([]);
    const [agentFixedTrans, setAgentFixedTrans] = useState([]);
    const [clientFixedTrans, setClientFixedTrans] = useState([]);
    const [fixedTranscription, setFixedTranscription] = useState("");

    function setUserAudioHandler(audio){
        setUserAudio(audio);
    }

    function setAudioNameHandler(name){
        setAudioName(name);
    }

    function setSelectedTranscriptionHandler(transcription){
        setSelectedTranscription(transcription);
    }

    function setSelectedCategoryHandler(category){
        setSelectedCategory(category);
    }

    function setWorkStatusHandler(status){
        setWorkStatus(status);
    }

    function setCurrentIdHandler(id){
        setCurrentId(id);
    }

    function setDataIsLoadedHandler(status){
        setDataIsLoaded(status);
    }

    function setCompleteRecordingHandler(audio){
        setCompleteRecording(audio);
    }

    function setAgentAudiosHandler(clips){
        setAgentAudios(clips);
    }

    function setClientAudiosHandler(clips){
        setClientAudios(clips);
    }

    function setAgentOriginalTransHandler(file){
        setAgentOriginalTrans(file);
    }

    function setClientOriginalTransHandler(file){
        setClientOriginalTrans(file);
    }

    function setAgentFixedTransHandler(file){
        setAgentFixedTrans(file);
    }

    function setClientFixedTransHandler(file){
        setClientFixedTrans(file);
    }

    function setFixedTranscriptionHandler(transcription){
        setFixedTranscription(transcription);
    }

    function markTranscriptionHandler(id){
        if(selectedCategory === "agent"){
            let data = [...agentAudios]
            data[id]["transcribed"] = true;
            setAgentAudios(data);
            updateWorkStatus(data)

        }else if(selectedCategory === "client"){
            let data = [...clientAudios]
            data[id]["transcribed"] = true;
            setClientAudios(data);
            updateWorkStatus(data)
        }
    }
    function unmarkTranscriptionHandler(id, category){
        if(selectedCategory === "agent"){
            let data = [...agentAudios]
            data[id]["transcribed"] = false;
            setAgentAudios(data);
            updateWorkStatus(data)

        }else if(selectedCategory === "client"){
            let data = [...clientAudios]
            data[id]["transcribed"] = false;
            setClientAudios(data);
            updateWorkStatus(data)

        }
    }

    function deleteClipHandler(id){
        let data;
        if(selectedCategory === "agent"){
            data = [...agentAudios]
            data.splice(id, 1);
            let counter = 0;
            data.forEach((clip) => {
                clip["id"] = counter;
                counter ++;
            });

            setAgentAudios(data);
            let transcripts = [...agentOriginalTrans];
            transcripts.splice(id, 1);
            setCurrentId(0);
            setAgentOriginalTrans(transcripts);
            updateWorkStatus(data)

            transcripts = [...agentFixedTrans];
            transcripts.splice(id, 1);
            setAgentFixedTrans(transcripts);

        }else if(selectedCategory === "client"){
            data = [...clientAudios]
            data.splice(id, 1);
            let counter = 0;
            data.forEach((clip) => {
                clip["id"] = counter;
                counter ++;
            });

            setClientAudios(data);
            let transcripts = [...clientOriginalTrans];
            transcripts.splice(id, 1);
            setCurrentId(0);
            setClientOriginalTrans(transcripts);
            updateWorkStatus(data);

            transcripts = [...clientFixedTrans];
            transcripts.splice(id, 1);
            setClientFixedTrans(transcripts);

        }
        
    }

    function updateWorkStatus(data){
        let transcribedCounter = 0;
        if(selectedCategory === "agent"){
            data.forEach((clip) => {
                if(clip["transcribed"]){ transcribedCounter++}
            })
            let status = workStatus
            status["agentDone"] = transcribedCounter
            status["agentTotal"] = data.length
            setWorkStatus(status);

        }else if(selectedCategory === "client"){
            data.forEach((clip) => {
                if(clip["transcribed"]){ transcribedCounter++}
            })
            let status = workStatus
            status["clientDone"] = transcribedCounter
            status["clientTotal"] = data.length
            setWorkStatus(status);

        }

    }

    const context = {
        audio: userAudio,
        audioName: audioName,
        selected_transcription: selectedTranscription,
        selectedCategory: selectedCategory,
        workStatus: workStatus,
        currentId: currentId,
        dataIsLoaded: dataIsLoaded,
        completeRecording: completeRecording,
        agent_audios: agentAudios,
        client_audios: clientAudios,
        agent_original_trans: agentOriginalTrans,
        client_original_trans: clientOriginalTrans,
        agent_fixed_trans: agentFixedTrans,
        client_fixed_trans: clientFixedTrans,
        fixed_transcription: fixedTranscription,
        setCurrentClip: setUserAudioHandler,
        setAudioName: setAudioNameHandler,
        setSelectedTranscription: setSelectedTranscriptionHandler,
        setSelectedCategory : setSelectedCategoryHandler,
        setWorkStatus: setWorkStatusHandler,
        setCurrentId: setCurrentIdHandler,
        setDataIsLoaded: setDataIsLoadedHandler,
        setCompleteRecording: setCompleteRecordingHandler,
        setAgentAudios: setAgentAudiosHandler,
        setClientAudios: setClientAudiosHandler,
        setAgentOriginalTrans: setAgentOriginalTransHandler,
        setClientOriginalTrans: setClientOriginalTransHandler,
        setAgentFixedTrans: setAgentFixedTransHandler,
        setClientFixedTrans: setClientFixedTransHandler,
        setFixedTranscription: setFixedTranscriptionHandler,
        markTranscription: markTranscriptionHandler,
        unmarkTranscription: unmarkTranscriptionHandler,
        deleteClip: deleteClipHandler
    };

    return <AppContext.Provider value={context}>
            {props.children}
           </AppContext.Provider>

}

export default AppContext;