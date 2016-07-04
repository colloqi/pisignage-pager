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

export function updatePlayer(player) {
    return {
        type: actionTypes.UPDATE_PLAYER,
        player
    }
}


export function checkPlayer(ip) {
    return (dispatch,getState) => {
        const players = getState().token.players;
        let player = players.find(function(player) {
            return player.ip === ip;
        })
        if (!player) {      //Add the player
            player = {
                ip: ip,
                enabled: true,
                name: "",
                active: false
            }
            dispatch(addPlayer(player))
        }
        const token = getState().token.settings.credentials.token
        return fetch('http://'+ip+':8000/'+urls.settings, {
            method: 'GET',
            headers: {
                'authorization': token
            }
        }).then(
            response => {
                response.json().then(function (data) {
                    if (!data.success) {
                        player.active = false
                        dispatch(updatePlayer(player))
                    } else {
                        player.name = data.data.name
                        player.active = true
                        player.version = data.data.version
                        
                        dispatch(updatePlayer(player))
                    }
                })
            },
            error => {
                player.active = false
                dispatch(updatePlayer(player))
            }
        )
    }
}

export function postUrl(options) {
    return (dispatch,getState) => {
        const auth = getState().auth
        return fetch(options.url, {
            method: 'POST',
            headers: {
                'authorization': auth.accessToken,
                'Content-Type': options.contentType
            },
            body: options.body
        }).then(
            response => {
                response.json().then(function (data) {
                    if (data.error) {
                        dispatch(message(data.error.message, data.error.type))
                    } else {
                        dispatch(receivedData(data, options.key))
                    }
                })
            },
            error => dispatch(message('Error posting data', error))
        )
    }
}

export function uploadFile(files) {
    return (dispatch,getState) => {
        const auth = getState().auth
        return fetch(urls.containers + '/' + getDarGroup().id + '/upload', {
            method: 'POST',
            headers: {
                'authorization': auth.accessToken
            },
            body: files
        }).then(
            response => {
                response.json().then(function (data) {
                    dispatch(fileUploaded(data))
                })
            },
            error => dispatch(message('Error uploading file', error))
        )
    }
}


