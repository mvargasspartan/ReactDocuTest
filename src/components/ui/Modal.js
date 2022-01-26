import classes from '../../styles/Modal.module.css';
import PropTypes from 'prop-types';


/**
* Basic modal component for alerts.
*/
function Modal(props) {
    Modal.propTypes = {
        /** Passthrough function call for any behavior that should trigger with the **confirm** button. If this prop is passed, the componet will know that it needs to render two buttons (confirm/cancel). */
        confirm: PropTypes.func,
        /** Passthrough function call for any behavior that should trigger with the **cancel** button. */
        cancel: PropTypes.func,
        /** Passthrough function call for any behavior that should trigger with the **accept** button. If this prop is passed, the componet will know that it needs to render only one button (accept). */
        accept: PropTypes.func
        };

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
