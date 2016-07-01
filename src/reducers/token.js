import * as actionTypes from '../constants/ActionTypes';

let initState = {
    settings: {
        sound:{volume: 5},
        lan: {startip: "192.168.1.1", endip: "10"},
        credentials: {user: "pi", password: "pi", token:""},
        counter: {from:1,till:100}
    },
    players: [],
    tokens: [],
    selectedToken: null,
    counters: []
}

export default function reducer(state = initState, action) {
    switch (action.type) {
        case actionTypes.SET_VOLUME:
            var newstate = Object.assign({}, state)
            newstate.settings.sound.volume = action.volume
            return newstate
        case actionTypes.CLEAR_TOKENS:
            return Object.assign({}, state, {tokens: []})
        case actionTypes.GENERATE_TOKENS:
            return Object.assign({}, state, {tokens: action.tokens})
        case actionTypes.ADD_COUNTER:
            return Object.assign({}, state, {counters: state.counters.concat(action.counter)})
        case actionTypes.DEL_COUNTER:
            var counters = state.counters.filter(function (itm) {
                return action.counter != itm;
            });
            return Object.assign({}, state, {counters: counters})
        case actionTypes.ADD_TOKEN:
            return Object.assign({}, state, {tokens: state.tokens.concat(action.token)})
        case actionTypes.SHOW_TOKEN:
            return Object.assign({}, state, {selectedToken: action.token})
        case actionTypes.DEL_TOKEN:
            var tokens = state.tokens.filter(function (itm) {
                return action.token != itm;
            });
            return Object.assign({}, state, {tokens: tokens})
        case actionTypes.ADD_PLAYER:
            return Object.assign({}, state, {players: state.players.concat(action.player)})
        case actionTypes.DEL_PLAYER:
            var players = state.players.filter(function (itm) {
                return action.player != itm;
            });
            return Object.assign({}, state, {players: players})
        case actionTypes.SET_USER:
            var newstate = Object.assign({}, state)
            newstate.settings.credentials = action.credentials
            return newstate
        default:
            return state;
    }
}