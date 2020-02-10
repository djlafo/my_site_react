function rootReducer(state={}, action) {
    const user = userReducer(state.user, action);
    return {
        apiURL: window.location.href.includes('localhost') ? 'http://localhost:3001/api' : 'http://dylanlafont.com:3001/api',
        socketURL: window.location.href.includes('localhost') ? 'ws://localhost:3001/' : 'wss://dylanlafont.com:3001/',
        user: user,
        logoutPending: action.type === 'logout' || (user && state.logoutPending )
    };
}

function userReducer(state, action) {
    if(action.type === 'update_user') {
        return action.data && action.data.user;
    } else {
        return state;
    }
}

export default rootReducer;
