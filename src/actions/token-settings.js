import * as actionTypes from '../constants/ActionTypes';
import urls from '../constants/urls';
import async from 'async';
import {displayToken} from './token';

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

export function setCounter(counter) {
    return {
        type: actionTypes.EDIT_COUNTER,
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

export function editCounter(counter) {
    return (dispatch, getState) => {
        var enabledPlayers = getState().token.players.filter(function(obj) {
            return obj.enabled && obj.counter && obj.counter.name == counter.name;
        })
        var object = {rollOverTime: counter.rollOverTime, lifeTimer: counter.lifeTime, deleteOnShow: counter.deleteOnShow};
        function send(player, cb) {
            fetch('http://'+player.ip+':8000/'+urls.token, {
                method: 'POST',
                headers: {
                    'authorization': getState().token.settings.credentials.token,
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify(object)
            }).then(
                response => cb(),
                error => cb()
            )
        }
        async.eachLimit(enabledPlayers, enabledPlayers.length, send, function() {
            dispatch(setCounter(counter))
            dispatch(displayToken(getState().token.showingTokens[counter.name],counter));
        })
    }
}

export function uploadSoundFile(file) {
    return (dispatch, getState) => {
        var enabledPlayers = getState().token.players.filter(function(obj) {
            return obj.enabled && obj.active;
        })
        var formData = new FormData();
        formData.append('file', file);
        function sendFile(player, cb) {
            fetch('http://'+player.ip+':8000/'+urls.tokenFile, {
                method: 'POST',
                headers: {
                    'authorization': getState().token.settings.credentials.token
                },
                body: formData
            }).then(
                response => cb(),
                error => cb()
            )
        }
        async.eachLimit(enabledPlayers, enabledPlayers.length, sendFile, function() {
            
        })
    }
}