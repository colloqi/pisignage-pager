import * as actionTypes from '../constants/ActionTypes';

let initState = {
    settings: {
        sound:{volume: 5},
        lan: {startip: "192.168.1.1", endip: "10"},
        credentials: {user: "pi", password: "pi", token:"Basic cGk6cGk="},
        counter: {from:1,till:100}
    },
    players: [],
    tokens: [],
    selectedToken: null,
    selectedCounter: null,
    counters: [],
    showingTokens: {}
}

export default function reducer(state = initState, action) {
    switch (action.type) {
        case actionTypes.SET_VOLUME:
            var newstate = Object.assign({}, state)
            newstate.settings.sound.volume = action.volume
            return newstate
        case actionTypes.CLEAR_ALL_SETTINGS:
            return Object.assign({}, state, initState)
        case actionTypes.CLEAR_TOKENS:
            return Object.assign({}, state, {tokens: []})
        case actionTypes.GENERATE_TOKENS:
            return Object.assign({}, state, {tokens: action.tokens})
        case actionTypes.ADD_COUNTER:
            var counter = {name:action.counter, rollOverTime:null, lifeTime: null, deleteOnShow: false};
            state.counters.length == 0 ? delete state.showingTokens['counter'] : '';
            return Object.assign({}, state, {counters: state.counters.concat(counter)})
        case actionTypes.DEL_COUNTER:
            var counters = state.counters.filter(function (itm) {
                return action.counter != itm;
            });
            delete state.showingTokens[action.counter.name];
            return Object.assign({}, state, {counters: counters})
        case actionTypes.EDIT_COUNTER:
            var counters = state.counters,
                old = counters.find(function(itm) {
                    return action.counter.name == itm.name;
                });
            counters[counters.indexOf(old)] = action.counter;
            return Object.assign({},state, {counters: counters})
        case actionTypes.ADD_TOKEN:
            return Object.assign({}, state, {tokens: state.tokens.concat(action.token)})
        case actionTypes.SHOW_TOKEN:
            var showingTokens = state.showingTokens || {},
                counter = action.counter || {name: 'counter', deleteOnShow: false};
            var prevToken = showingTokens[counter.name];
            showingTokens[counter.name] = action.token;
            var tokens = state.tokens;
            counter.deleteOnShow ? tokens.splice(tokens.indexOf(prevToken),1) : '';
            return Object.assign({}, state, {selectedToken: action.token, selectedCounter: action.counter, showingTokens: showingTokens, tokens: tokens})
        case actionTypes.DEL_TOKEN:
            var tokens = state.tokens.filter(function (itm) {
                return action.token != itm;
            });
            return Object.assign({}, state, {tokens: tokens})
        case actionTypes.ADD_PLAYER:
            return Object.assign({}, state, {players: state.players.concat(action.player)})
        case actionTypes.UPDATE_PLAYER:
            var newPlayers = state.players.slice()
            var player = newPlayers.find(function(player) {
                return player.ip === action.player.ip;
            })
            Object.assign(player, action.player)
            return Object.assign({}, state, {players: newPlayers})
        case actionTypes.DEL_PLAYER:
            var players = state.players.filter(function (itm) {
                return action.player.ip != itm.ip;
            });
            return Object.assign({}, state, {players: players})
        case actionTypes.SCAN_PLAYERS:
            return Object.assign({}, state, {players: Object.values(action.players)})
        case actionTypes.ASSIGN_COUNTER:
            let players = state.players;
            players[players.indexOf(action.player)].counter = action.counter;
            return Object.assign({}, state, {players: players})
        case actionTypes.SET_USER:
            var newstate = Object.assign({}, state)
            newstate.settings.credentials = action.credentials
            return newstate
        default:
            state.tokens = state.tokens || [];
            return state;
    }
}