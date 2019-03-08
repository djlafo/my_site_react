import React, { Component } from 'react';
import { connect } from 'react-redux';

class ApiRedirect extends Component {
    componentDidMount() {
        if(this.props.apiURL) {
            window.location = `${this.props.apiURL}${window.location.pathname.substring(4)}`;
        }
    }

    render() { 
        return <div></div>;
    }
}

function mapStateToProps(state) {
    return {
        apiURL: state.apiURL
    }
}

export default connect(mapStateToProps)(ApiRedirect);
