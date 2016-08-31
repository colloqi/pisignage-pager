import fetch from 'isomorphic-fetch';
import * as actionTypes from '../constants/ActionTypes';
import urls from '../constants/urls';
import async from 'async';

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

export function message(title, content) {
    return {
        type: actionTypes.MESSAGE,
        title,
        content
    }
}

export function assignCounter(player, counter) {
    return (dispatch, getState) => {
        var object = {rollOverTime: counter.rollOverTime, lifeTimer: counter.lifeTime, deleteOnShow: counter.deleteOnShow,
                        counterName: counter.name, currentToken: getState().token.showingTokens[counter.name]};
        fetch('http://'+player.ip+':8000/'+urls.token, {
            method: 'POST',
            headers: {
                'authorization': getState().token.settings.credentials.token,
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(object)
        }).then(
            response => {
                response.status < 400 ? player.counter = counter : player.errorMessage = 'Error setting counter: '+response.statusText;
                dispatch(updatePlayer(player))
            },
            error => {
                player.errorMessage = 'Error: could not set counter to player';
                dispatch(updatePlayer(player))
            }
        )
    }
}

export function scanNetwork(startip, totalips) {
    return (dispatch,getState) => {
        let addressPrefix = startip.slice(0,startip.lastIndexOf('.')+1),
            address = parseInt(startip.slice(startip.lastIndexOf('.')+1)),
            end = parseInt(startip.slice(startip.lastIndexOf('.')+1)) + (parseInt(totalips) - 1), ips = [];
        const token = getState().token.settings.credentials.token
        function pingPlayers(ip,cb) {
            fetch('http://'+ip+':8001/', {
                method: 'GET',
                headers: {
                    'authorization': token
                }
            }).then(
                response => {
                    response.text().then(parsedResponse => {
                        if (parsedResponse.indexOf("PiSignage Player") >= 0) {
                            dispatch(checkPlayer(ip));
                            cb();
                        }
                    });
                },
                error => cb()
            )
        }
        for(var i=address; i<= end; i++) {
            ips.push(addressPrefix+i);
        }

        async.eachLimit(ips,ips.length,pingPlayers,function(err) {
            
        })
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
                active: false,
                counter: getState().token.counters[0] || {}
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
                if (response.status > 400) {
                    player.errorMessage = 'Error accessing player: '+response.statusText;
                    dispatch(updatePlayer(player))
                } else {
                    player.errorMessage = null;
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
                }
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


