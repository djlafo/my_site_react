function rootReducer(state={}, action) {
    const user = userReducer(state.user, action);
    return {
        apiURL: process.env.apiURL || 'http://localhost:3001/api',
        serverURL: process.env.serverURL || 'localhost:3001',
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