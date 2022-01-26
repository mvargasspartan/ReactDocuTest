import {Link} from 'react-router-dom';

import classes from '../../styles/MainNavigation.module.css'
import {ReactComponent as SpartanLogo} from '../../icons/SpartaLogo.svg';

/**
* Component that handles the navigation links in the app's header (Transcription, Guidelines).
* It doesn't contain props or methods.
*/
function MainNavigation() {


    return(
        <header className={classes.header}>
            <span><SpartanLogo></SpartanLogo></span>
            <div className={classes.logo}>Sparta Hearing Labeling Tool</div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Transcription</Link>
                    </li>
                    <li>
                        <Link to="/guidelines">Guidelines</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default MainNavigation;


