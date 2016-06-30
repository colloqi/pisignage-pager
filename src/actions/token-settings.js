import fetch from 'isomorphic-fetch';
import * as actionTypes from '../constants/ActionTypes';
import urls from '../constants/urls';

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

export function addToken(token) {
    return {
        type: actionTypes.ADD_TOKEN,
        token
    }
}

export function delToken(token) {
    return {
        type: actionTypes.DEL_TOKEN,
        token
    }
}

export function setUser(credentials) {
    window.localStorage.credentials = JSON.stringify(credentials)
    var token = 'Basic '+btoa($scope.credentials.username+':'+$scope.credentials.password);
    window.localStorage.TOKEN = token;
    return {
        type: actionTypes.SET_USER,
        credentials
    }
}



export function fetchUrl(options) {
    return (dispatch,getState) => {
        const auth = getState().auth
        return fetch(options.url, {
            method: 'GET',
            headers: {
                'authorization': auth.accessToken
            }
        }).then(
            response => {
                response.json().then(function (data) {
                    if (data.error) {
                        dispatch(message(data.error.message))
                    } else {
                        dispatch(receivedData(data, options.key))
                    }
                })
            },
            error => dispatch(message('Error fetching data', error))
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
