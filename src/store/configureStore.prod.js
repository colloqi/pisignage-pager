import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import persistState from 'redux-localstorage'

const finalCreateStore = compose(
    applyMiddleware(thunkMiddleware, persistState(null,{"key":"pager"}))
)(createStore);

module.exports = function configureStore(preloadedState) {
    return finalCreateStore(rootReducer, preloadedState);
};
