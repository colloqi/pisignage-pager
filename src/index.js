import React, {Component} from 'react';
/**
 * Import the stylesheet you want used! Here we just reference
 * the main SCSS file we have in the styles directory.
 */
import 'babel-polyfill';
import {polyfill} from 'es6-promise';

polyfill();

/**
 * Both configureStore and Root are required conditionally.
 * See configureStore.js and Root.js for more details.
 */
import {configureStore} from './store/configureStore';
import {Root} from './containers/Root';

//import {hashHistory} from 'react-router'
//import {syncHistoryWithStore} from 'react-router-redux'

let initState = {
}
//do not use initState here unless for persistent reasons, it is used in reducers

const store = configureStore();

export default class App extends Component {
    render() {
        return (
            <Root store={store} />
        )
    }
}
