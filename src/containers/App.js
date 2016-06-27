import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Route, IndexRoute, Router} from 'react-router';

import Layout from './Layout';
import PlayerSettings from '../components/player-settings';

/**
 * It is common practice to have a 'Root' container/component require our main App (this one).
 * Again, this is because it serves to wrap the rest of our application with the Provider
 * component to make the Redux store available to the rest of the app.
 */
class App extends Component {
    render() {
        let {history} = this.props;

        return (
            <Router histoy={history}>
                <Route path='/' component={Layout} />
                <Route path='players/:playerId' component={PlayerSettings} />
            </Router>
        );
    }
}

App.propTypes = {
    history: PropTypes.object.isRequired,
};

/**
 * Keep in mind that 'state' isn't the state of local object, but your single
 * state in this Redux application. 'counter' is a property within our store/state
 * object. By mapping it to props, we can pass it to the child component Counter.
 */
function mapStateToProps(state) {
    return {
    };
}

/**
 * Turns an object whose values are 'action creators' into an object with the same
 * keys but with every action creator wrapped into a 'dispatch' call that we can invoke
 * directly later on. Here we imported the actions specified in 'Actions.js' and
 * used the bindActionCreators function Redux provides us.
 *
 * More info: http://redux.js.org/docs/api/bindActionCreators.html
 */
/*
 function mapDispatchToProps(dispatch) {
 return {
 actions: bindActionCreators(Actions, dispatch)
 };
 }
 */

/**
 * 'connect' is provided to us by the bindings offered by 'react-redux'. It simply
 * connects a React component to a Redux store. It never modifies the component class
 * that is passed into it, it actually returns a new connected componet class for use.
 *
 * More info: https://github.com/rackt/react-redux
 */

export default connect(
    mapStateToProps
    //mapDispatchToProps
)(App);
