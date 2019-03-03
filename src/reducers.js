function rootReducer(state={}, action) {
    return {
        apiURL: window.location.href.includes('localhost') ? 'http://localhost:3001/api' : 'https://dylanlafont.com:3001/api',
        user: userReducer(state.user, action)
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