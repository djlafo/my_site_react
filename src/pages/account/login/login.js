import React, { Component } from 'react';
import { connect } from 'react-redux';
import './login.css'
import Ajax from '../../../classes/ajax'

import Card from '../../../components/card/card'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginInfo: {
                username: '',
                password: ''
            },
            errorMessage: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        Ajax.post(`${this.props.apiURL}/users/login`, {data: {user: this.state.loginInfo}}, (err,res,body) => {
            const fields = 'email or password';
            if(body.errors && body.errors[fields]) {
                this.setState({
                    errorMessage: `${fields} ${body.errors[fields]}`
                });
            } else {
                this.props.handleLogin(body);
            }
        });
    }

    handleFormChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(function(state) {
            return {
                loginInfo: Object.assign(state.loginInfo, {[name]: value})
            };
        });
    }

    render() {
        return (
            <div className="login">
                <Card>
                    <form onSubmit={this.handleSubmit}>
                        <input autoComplete="on"
                            name="username"
                            value={this.state.loginInfo.username}
                            required
                            onChange={this.handleFormChange}
                            placeholder="Username" />
                        <br />
                        <input autoComplete="on"
                            name="password"
                            value={this.state.loginInfo.password}
                            required
                            onChange={this.handleFormChange}
                            placeholder="Password" 
                            type="password"/>
                        <br />
                        <span className="error">
                          {this.state.errorMessage}
                        </span>
                        <input type="submit" value="submit" />
                    </form>
                </Card>
            </div>
        );
    }
}

function mapStateToDispatch(dispatch) {
    return {
        handleLogin: (user) => dispatch({ type: 'update_user', data: user})
    }
}

function mapStateToProps(state) {
    return {
        apiURL: state.apiURL
    }
}

export default connect(mapStateToProps, mapStateToDispatch)(Login);