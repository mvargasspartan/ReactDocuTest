import classes from '../../styles/CardTextArea.module.css';

function CardTextArea(props) {
    return(
        <div className={classes.card}>
            {props.children}
        </div>
    );
}

export default CardTextArea;