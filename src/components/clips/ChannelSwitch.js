import { useContext, useState } from 'react';
import { Grid } from "@material-ui/core";
import PropTypes from 'prop-types';
import classes from '../../styles/ChannelSwitch.module.css';
import AppContext from '../../store/AppContext.js';


/**
* Component for switching between the two audio channels (Agent/Client)
*/
function ChannelSwitch(props){
    ChannelSwitch.propTypes = {
        /** Calls function *toggleAgentClips* of parent component *TranscriptionTool* */
        toggleAgent: PropTypes.func,
        /** Calls function *toggleClientClips* of parent component *TranscriptionTool* */
        toggleClient: PropTypes.func
        };

    const context = useContext(AppContext);
    const [selectedCategory, setSelectedCategory] = useState("agent");



    let content;

    function setAgentCategory(){
        if(context.currentId !== -1){context.setCurrentId(0);}
        setSelectedCategory("agent")
        props.toggleAgent();
    }

    function setClientCategory(){
        if(context.currentId !== -1){context.setCurrentId(0);}
        setSelectedCategory("client")
        props.toggleClient();
    }

    

    if(selectedCategory === "agent"){

        content = <div style={{ margin: "0 0.5rem" }}>
                    <Grid container>
                        <Grid item xs={6}>
                            <button onClick={setAgentCategory} className={classes.selected}>
                                {"Agent Clips"}
                            </button>
                        </Grid>
                        <Grid item xs={6}>
                            <button onClick={setClientCategory} className={classes.btn}>
                                {"Client Clips"}
                            </button>
                        </Grid>
                    </Grid>
                    <div style={{ textAlign: "center" }}>
                        <button onClick={setAgentCategory} className={classes.btnBadge}>
                            {"Clips Done: "}
                            <span className={classes.badgeSelected}>{`${context.workStatus["agentDone"]} / ${context.workStatus["agentTotal"]}`}</span>
                        </button>
                    </div>
                  </div>

    }else if(selectedCategory === "client"){

        content = <div style={{ margin: "0 0.5rem" }}>
                    <Grid container>
                        <Grid item xs={6}>
                            <button onClick={setAgentCategory} className={classes.btn}>
                                {"Agent Clips"}
                            </button>
                        </Grid>
                        <Grid item xs={6}>
                            <button onClick={setClientCategory} className={classes.selected}>
                                {"Client Clips"}
                            </button>
                        </Grid>
                    </Grid>
                    <div style={{ textAlign: "center" }}>
                        <button onClick={setAgentCategory} className={classes.btnBadge}>
                            {"Clips Done: "}
                            <span className={classes.badgeSelected}>{`${context.workStatus["clientDone"]} / ${context.workStatus["clientTotal"]}`}</span>
                        </button>
                    </div>
                </div>      

    }
    return(
        <div>{content}</div>
    );

}

export default ChannelSwitch;