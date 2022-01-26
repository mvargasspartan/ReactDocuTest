import {useContext, useState, forwardRef, useImperativeHandle, useEffect} from 'react'
import AudioPlayer from 'react-h5-audio-player';
import '../styles/AudioPlayerStyles.css';
import classes from '../styles/AudioPlayerWidget.module.css';

import AppContext from '../store/AppContext.js';
import PropTypes from 'prop-types';

/**
* Basic audio player component. Uses react h5 audio player.
*/
function AudioPlayerWidget(props, ref){
    AudioPlayerWidget.propTypes = {
        /** Name of the audio source (clip/ recording). */
        name: PropTypes.string,
        /** Complete recording audio blob. */
        completeAudio: PropTypes.string
        };

    const context = useContext(AppContext);
    const [audio, setAudio] = useState([])

    useImperativeHandle(ref, () => ({

        handleAudio(){
            setAudio(context.audio);
            
        },
    
      }))

    useEffect(() => {
        if(props.completeAudio !== undefined & props.completeAudio !== -1){
            setAudio(props.completeAudio);
        }
    },[props]);
    
    
    return(
        <div>
            <h3 className={classes.h3}>{props.name}</h3>
            <AudioPlayer
            src={audio}
            autoPlay={false}
            autoPlayAfterSrcChange={false}
            />
        </div>
    );
}

export default forwardRef(AudioPlayerWidget);