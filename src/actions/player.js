import fetch from 'isomorphic-fetch';
import * as actionTypes from '../constants/ActionTypes';
import urls from '../constants/urls';

export function addPlayer(player) {
    return {
        type: actionTypes.ADD_PLAYER,
        player
    }
}

export function delPlayer(player) {
    return {
        type: actionTypes.DEL_PLAYER,
        player
    }
}

