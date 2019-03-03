import React, { Component } from 'react';
import { connect } from 'react-redux';
import './account.css';

import Login from './login/login'

class Account extends Component {
    render() {
        return (
            <div className="account">
                { 
                    !!this.props.user ? 
                    <div>
                        Logged in as {this.props.user.displayName}
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

export default connect(mapStateToProps)(Account);