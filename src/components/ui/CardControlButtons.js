import classes from '../../styles/CardControlButtons.module.css';

function CardControlButtons(props) {
    return(
        <div className={classes.card}>
            {props.children}
        </div>
    );
}

export default CardControlButtons;