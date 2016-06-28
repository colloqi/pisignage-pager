import * as actionTypes from '../constants/ActionTypes';

let initState = {
    volume: 5,
    tokens: [],
    counters: []
}

export default function reducer(state = initState, action) {
    switch (action.type) {
        case actionTypes.SET_VOLUME:
            return Object.assign({}, state, {volume: action.volume})
        case actionTypes.CLEAR_TOKENS:
            return Object.assign({}, state, {tokens: []})
        case actionTypes.GENERATE_TOKENS:
            return Object.assign({}, state, {tokens: action.tokens})
        default:
            return state;
    }
}