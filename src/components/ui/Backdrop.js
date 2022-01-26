import classes from '../../styles/Backdrop.module.css'
import PropTypes from 'prop-types';

/**
* Basic backdrop component.
*/
function Backdrop(props) {
    Backdrop.propTypes = {
        /** Passthrough function call for the onClick method of the backdrop */
        onClick: PropTypes.func
        };

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