import classes from '../../styles/CardTextArea.module.css';


/**
* Basic card component that wraps around the *TranscriptionTextArea* component.
*/
function CardTextArea(props) {
    return(
        <div className={classes.card}>
            {props.children}
        </div>
    );
}

export default CardTextArea;