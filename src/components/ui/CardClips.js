import classes from '../../styles/CardClips.module.css';
import PropTypes from 'prop-types';

/**
* Basic card component that handles the onClick event of the audio clips.
*/
function CardClips(props) {
    CardClips.propTypes = {
        /** Calls the function *toggleIsClicked* of the *Clip* component. */
        customClickEvent: PropTypes.func,
        /** Is the current clip card selected. */
        selected: PropTypes.bool
        };
        

    let content;

    if(props.selected){
        content = <div onClick={props.customClickEvent} className={classes.cardSelected}>
                    {props.children}
                  </div>
    }
    else{
        content = <div onClick={props.customClickEvent} className={classes.card}>
                    {props.children}
                  </div>
    }
    return(
        <div>
            {content}
        </div>
    );
}

export default CardClips;