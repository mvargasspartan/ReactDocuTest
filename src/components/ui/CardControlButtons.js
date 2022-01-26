import classes from '../../styles/CardControlButtons.module.css';

/**
* Basic card component that wraps around the *ControlButtons* component
*/
function CardControlButtons(props) {
    return(
        <div className={classes.card}>
            {props.children}
        </div>
    );
}

export default CardControlButtons;