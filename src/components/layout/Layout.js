import MainNavigation from './MainNavigation';
import PropTypes from 'prop-types';
import { Routes } from 'react-router-dom';


/**
* Component for encapsulating the *routes* or "pages" of the app.
* Defines the basic structure of the HTML elements.
*/
function Layout(props) {
    Layout.propTypes = {
        /** Gets all the children components of this component. */
        children: PropTypes.instanceOf(Routes)
        };
    return(
        <div>
            <MainNavigation />
            <main>
                {props.children}
            </main>
        </div>
    );
}

export default Layout;