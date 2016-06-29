import * as actionTypes from '../constants/ActionTypes';

let initState = {
    volume: 5,
    players: [],
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
        case actionTypes.ADD_COUNTER:
            return Object.assign({}, state, {counters: state.counters.concat(action.counter)})
        case actionTypes.DEL_COUNTER:
            var counters = state.counters.filter(function(itm){
                return action.counter != itm;
            });
            return Object.assign({}, state, {counters: counters})
        case actionTypes.ADD_TOKEN:
            return Object.assign({}, state, {tokens: state.tokens.concat(action.token)})
        case actionTypes.DEL_TOKEN:
            var tokens = state.tokens.filter(function(itm){
                return action.token != itm;
            });
            return Object.assign({}, state, {tokens: tokens})
        case actionTypes.ADD_PLAYER:
            return Object.assign({}, state, {players: state.players.concat(action.player)})
        case actionTypes.DEL_PLAYER:
            var players = state.players.filter(function(itm){
                return action.player != itm;
            });
            return Object.assign({}, state, {players: players})
        default:
            return state;
    }
}