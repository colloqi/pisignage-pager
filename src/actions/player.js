import fetch from 'isomorphic-fetch';
import * as actionTypes from '../constants/ActionTypes';
import urls from '../constants/urls';

export function addPlayer(ip) {
    return {
        type: actionTypes.ADD_PLAYER,
        ip
    }
}

export function delPlayer(ip) {
    return {
        type: actionTypes.DEL_PLAYER,
        ip
    }
}

export function enablePlayer(ip,enabled) {
    return {
        type: actionTypes.ENABLE_PLAYER,
        ip,
        enabled
    }
}

