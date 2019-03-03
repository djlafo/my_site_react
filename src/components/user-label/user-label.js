import React, { Component } from 'react';

import AdminIcon from './admin_icon.png';
import './user-label.css'

class UserLabel extends Component {
    constructor(props) {
        super(props);
        this.getBadge = this.getBadge.bind(this);
    }

    getBadge(role) {
        if(role === 'Admin') {
            return <img className="admin-icon" src={AdminIcon} alt="Admin" />
        }
    }

    render() {
        return (
            <div className="user-label">
                {this.getBadge(this.props.user.role)}
                {this.props.user.displayName}
                ({this.props.user.username})
            </div>
        );
    }
}

export default UserLabel;