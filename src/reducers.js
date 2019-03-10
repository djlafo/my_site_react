function rootReducer(state={}, action) {
    const user = userReducer(state.user, action);
    return {
        apiURL: window.location.href.includes('localhost') ? 'http://localhost:3001/api' : 'https://dylanlafont.com:3001/api',
        serverURL: window.location.href.includes('localhost') ? 'localhost:3001' : 'dylanlafont.com:3001',
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