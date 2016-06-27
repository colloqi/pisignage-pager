import React from 'react';
import ReactDOM from 'react-dom';
/**
 * Import the stylesheet you want used! Here we just reference
 * the main SCSS file we have in the styles directory.
 */
import './styles/main.scss';
import 'babel-polyfill';
import injectPlugin from "react-tap-event-plugin";
import {polyfill} from 'es6-promise';

injectPlugin();
polyfill();

/**
 * Both configureStore and Root are required conditionally.
 * See configureStore.js and Root.js for more details.
 */
import {configureStore} from './store/configureStore';
import {Root} from './containers/Root';

import {hashHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'

let initState = {
}
//do not use initState here unless for persistent reasons, it is used in reducers

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store)

ReactDOM.render(
    <Root store={store} history={history}/>,
            document.getElementById('root')
);
