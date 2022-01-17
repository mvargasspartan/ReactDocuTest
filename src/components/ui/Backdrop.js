import classes from '../../styles/Backdrop.module.css'

function Backdrop(props) {
    let content;

    if(props.onClick){
        content = <div className={classes.backdrop} onClick={props.onClick}/>;
    }else{
        content = <div className={classes.backdrop}/>;
    }
    return <div>
        {content}
        </div>
}

export default Backdrop;