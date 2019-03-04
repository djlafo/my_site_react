import React, { Component } from 'react';
import { connect } from 'react-redux';
import './account.css';

import Login from './login/login';
import Cookies from '../../classes/cookies';

class Account extends Component {
    render() {
        return (
            <div className="account">
                { 
                    !!this.props.user ? 
                    <div>
                        Logged in as {this.props.user.displayName}<br/>
                        <button onClick={this.props.onLogout}>
                            Logout
                        </button>
                    </div>
                    :
                    <Login />
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onLogout: () => {
            Cookies.removeAllCookies();
            dispatch({type: 'update_user', data: null})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);