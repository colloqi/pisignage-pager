import fetch from 'isomorphic-fetch';
import * as actionTypes from '../constants/ActionTypes';
import urls from '../constants/urls';

export function clearAllSettings() {
    return {
        type: actionTypes.CLEAR_ALL_SETTINGS
    }
}

export function clearTokens() {
    return {
        type: actionTypes.CLEAR_TOKENS
    }
}

export function generateTokens(tokens) {
    return {
        type: actionTypes.GENERATE_TOKENS,
        tokens
    }
}

export function setVolume(volume) {
    return {
        type: actionTypes.SET_VOLUME,
        volume
    }
}

export function addCounter(counter) {
    return {
        type: actionTypes.ADD_COUNTER,
        counter
    }
}

export function delCounter(counter) {
    return {
        type: actionTypes.DEL_COUNTER,
        counter
    }
}

export function setUser(user,password) {
    var token = 'Basic '+btoa(user+':'+password);
    return {
        type: actionTypes.SET_USER,
        credentials: {
            user,
            password,
            token
        }
    }
}
