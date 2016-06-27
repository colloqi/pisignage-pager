import fetch from 'isomorphic-fetch';
import * as actionTypes from '../constants/ActionTypes';
import urls from '../constants/urls';

export function receivedData(data, key) {
    return {
        type: actionTypes.RECEIVED_DATA,
        data,
        key
    }
}

export function fileUploaded(data) {
    return {
        type: actionTypes.FILE_UPLOADED,
        data
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
