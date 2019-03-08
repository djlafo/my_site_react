import React, { Component } from 'react';
import { connect } from 'react-redux';
import './account.css';

import Login from './login';
import AccountManage from './account-manage'

class Account extends Component {
    render() {
        return (
            <div className="account">
                { 
                    !!this.props.user ? 
                    <AccountManage user={this.props.user} />
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