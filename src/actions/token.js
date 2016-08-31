import fetch from 'isomorphic-fetch';
import * as actionTypes from '../constants/ActionTypes';
import urls from '../constants/urls';
import async from 'async';

export function addToken(token) {
    return {
        type: actionTypes.ADD_TOKEN,
        token
    }
}

export function showToken(token,counter) {
    return {
        type: actionTypes.SHOW_TOKEN,
        token,
        counter
    }
}

export function delToken(token) {
    return {
        type: actionTypes.DEL_TOKEN,
        token
    }
}

let rollOverTimers = {};
let setRollOverTimer = function(dispatch, getState, counter) {
    function timer() {
        var token = getState().token,
            enabledPlayers = getState().token.players.filter(function(obj) {
                return obj.enabled && (!counter || (obj.counter && obj.counter.name === counter.name));
            });
        fetch('http://'+enabledPlayers[0].ip+':8000/'+urls.token, {
            method: 'GET',
            headers: {
                'authorization': getState().token.settings.credentials.token
            }
        }).then(response => {
            response.json().then(parsedData => {
                dispatch(showToken(parsedData.data.tokens[parsedData.data.currentTokenIndex], counter));
            });
        })
    }
    timer();
    rollOverTimers[counter.name] = setInterval(timer,(counter.rollOverTime*1000)+1);
}

export function newToken(token) {
    return (dispatch, getState) => {
        var tokens = getState().token.tokens,
            enabledPlayers = getState().token.players.filter(function(obj) {
                return obj.enabled;
            });
        function send(player, cb) {
            fetch('http://'+player.ip+':8000/'+urls.token, {
                method: 'POST',
                headers: {
                    'authorization': getState().token.settings.credentials.token,
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({tokens:tokens.concat([token])})
            }).then(
                response => cb(),
                error => cb()
            )
        }
        async.eachLimit(enabledPlayers, enabledPlayers.length, send, function() {
            dispatch(addToken(token))
        })
    }
}

export function removeToken(token) {
    return (dispatch, getState) => {
        var tokens = getState().token.tokens,
            enabledPlayers = getState().token.players.filter(function(obj) {
                return obj.enabled;
            });
        function send(player, cb) {
            fetch('http://'+player.ip+':8000/'+urls.token, {
                method: 'POST',
                headers: {
                    'authorization': getState().token.settings.credentials.token
                },
                body: JSON.stringify({tokens:tokens.splice(tokens.indexOf(token),1)})
            }).then(
                response => cb(),
                error => cb()
            )
        }
        async.eachLimit(enabledPlayers, enabledPlayers.length, send, function() {
            dispatch(delToken(token))
        })
    }
}

export function displayToken(token, counter) {
    return (dispatch,getState) => {
        var enabledPlayers = getState().token.players.filter(function(obj) {
            return obj.enabled && (!counter || (obj.counter && counter.name == obj.counter.name));
        })
        let object = {currentToken: token, tokens: getState().token.tokens, counterName: counter ? counter.name : ' ',
                        rollOverTime: counter ? counter.rollOverTime : null, volume: getState().token.settings.sound.volume,
                        lifeTime: counter ? counter.lifeTime : null, deleteOnShow: counter ? counter.deleteOnShow : null};
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
        if (token) {
            async.eachLimit(enabledPlayers, enabledPlayers.length, send, function() {
                clearInterval(rollOverTimers[counter ? counter.name : 'counter']);
                counter && counter.rollOverTime ? setRollOverTimer(dispatch, getState, counter) : '';
                dispatch(showToken(token,counter))
            })
        } else {
            clearInterval(rollOverTimers[counter ? counter.name : 'counter']);
            setRollOverTimer(dispatch, getState, counter);
        }
    }
}