import classes from '../../styles/CardClips.module.css';

function CardClips(props) {

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