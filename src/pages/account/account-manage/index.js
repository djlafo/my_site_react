import React, { Component } from 'react';
import { connect } from 'react-redux';
import './account-manage.css';
import Card from '../../../components/card';
import Cookies from '../../../classes/cookies';
import UserLabel from '../../../components/user-label'
import FileList from '../../../components/file-list'

class AccountManage extends Component {
    render() {
        return (
            <div className="account-manage">
                <Card>
                    <div>
                        <UserLabel user={this.props.user} />
                        <button onClick={this.props.onLogout}>
                            Logout
                        </button>
                    </div>
                    <FileList user={this.props.user} />
                </Card>
            </div>
        );
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

export default connect(null, mapDispatchToProps)(AccountManage);