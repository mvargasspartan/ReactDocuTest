import classes from '../../styles/Modal.module.css';
function Modal(props) {
    function confirm(){
        props.confirm();
    }
    function cancel(){
        props.cancel();
    }
    function accept(){
        props.accept();
    }

    let buttons = <div/>

    if(props.confirm){
        buttons  = <div>
        <button className={classes.btn} onClick={cancel}>Cancel</button>
        <button className={classes.btn} onClick={confirm}>Confirm</button>
      </div>
    }

    if(props.accept){
        buttons = <div>
                <button className={classes.btn} onClick={accept}>Accept</button>
              </div>
    }
    
    return(
        <div className={classes.modal}> 
            <p>{props.line1}</p>
            <p>{props.line2}</p>
            {buttons}
        </div>
    );
}

export default Modal;
