import fetch from 'isomorphic-fetch';
import * as actionTypes from '../constants/ActionTypes';
import urls from '../constants/urls';

export function addToken(token) {
    return {
        type: actionTypes.ADD_TOKEN,
        token
    }
}

export function showToken(token) {
    return {
        type: actionTypes.SHOW_TOKEN,
        token
    }
}

export function delToken(token) {
    return {
        type: actionTypes.DEL_TOKEN,
        token
    }
}

