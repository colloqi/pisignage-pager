import * as actionTypes from '../constants/ActionTypes';

let initState = {
    usersList: [],
    usersTree: [],
    lastReport: [],
    category: [],
    cycleStats: {},
    reports: [],
    stats: {}
}

function createTree(data, newstate) {
    let object = {}, reporteesTree = [];
    data.map(function (user) {
        user.items = [];
        object[user.id] = user;
    })
    data.forEach(function (user) {
        if (user.supervisor && user.supervisor.dbid) {
            object[user.supervisor.dbid].items.push(user);
        } else
            reporteesTree.push(user);
    });
    data.sort(function (a, b) {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
    })
    newstate.usersTree = reporteesTree;
}

export default function reducer(state = initState, action) {
    switch (action.type) {
        case actionTypes.RECEIVED_DATA:
            let newstate = Object.assign({}, state, {})
            if (action.key == 'usersList') {
                createTree(action.data, newstate);
            } else if (action.key == 'stats') {
                action.data = calculateCycleNumbers(action.data);
            }
            newstate[action.key] = action.data;
            return newstate;
        default:
            return state;
    }
}