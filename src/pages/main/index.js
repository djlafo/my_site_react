import React, { Component } from 'react';
import { connect } from 'react-redux';
import './main.css';
import { withRouter, Switch, Route } from "react-router-dom";


import Home from '../home';
import Contact from '../contact';
import Resume from '../resume';
import Account from '../account';
import DirectPost from '../direct-post';
import ApiRedirect from '../api-redirect';
import FourOhFour from '../four-oh-four';

import Sidebar from '../../components/sidebar';
import Footer from '../../components/footer';
import Topbar from '../../components/topbar';
import MainHeader from '../../components/main-header';
import Card from '../../components/card';
import Ajax from '../../classes/ajax';
import Cookies from '../../classes/cookies';
import WebSocketPanel from '../../components/web-socket-panel';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false
        };
        this.resetError = this.resetError.bind(this);
    }

    static getDerivedStateFromError(err) {
        return {error: err};
    }

    resetError() {
        this.setState({
            error: false
        });
    }

    componentDidMount() {
        Ajax.read(`${this.props.apiURL}/auth`, {
            auth: this.props.user.token
        }, (res) => {
            if(res.errors && this.props.user) {
                this.props.logout();
            }
        }, () => {
            if(this.props.user) this.props.logout();
        });
    }

    render() {

        return (
            <div className="main">
                <MainHeader />
                <Topbar subRoute={this.props.subRoute} />
                <div className="content">
                    {this.state.error ?
                        <div className="error-card random-error">
                            <Card> 
                                Error:<br/><br/>
                                {this.state.error}
                                <br/><br/>
                                <input type="button"
                                    alt="OK"
                                    value="OK"
                                    onClick={this.resetError} />
                            </Card>
                        </div>
                        :
                        <Switch>
                            <Route exact path={`${this.props.subRoute}/`} component={() => <Home />} />
                            <Route path={`${this.props.subRoute}/post`} component={() => <DirectPost />} />
                            <Route path={`${this.props.subRoute}/resume`} component={() => <Resume />} />
                            <Route path={`${this.props.subRoute}/contact`} component={() => <Contact />} />
                            <Route path={`${this.props.subRoute}/account`} component={() => <Account />} />
                            <Route path={`${this.props.subRoute}/api`} component={() => <ApiRedirect />} />
                            <Route component={() => <FourOhFour />} />
                        </Switch>
                    }
                    <Sidebar onRouteChange={this.redrawRouter} subRoute={this.props.subRoute} />
                </div>
                <Footer />
                <WebSocketPanel />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => {
            Cookies.removeAllCookies();
            dispatch({type: 'update_user', data: null})
        }
    }
}

function mapStateToProps(state) {
    return {
        apiURL: state.apiURL,
        user: state.user
    }
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Main)
);