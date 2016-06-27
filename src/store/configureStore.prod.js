import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';

const finalCreateStore = compose(
    applyMiddleware(thunkMiddleware)
)(createStore);

module.exports = function configureStore(preloadedState) {
    return finalCreateStore(rootReducer, preloadedState);
};
