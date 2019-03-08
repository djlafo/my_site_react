import React, { Component } from 'react';
import './main.css';
import { Switch, Route } from "react-router-dom";

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

class Main extends Component {
    render() {
        return (
            <div className="main">
                <div className="content">
                    <Topbar subRoute={this.props.subRoute} />
                    <Switch>
                        <Route exact path={`${this.props.subRoute}/`} component={() => <Home />} />
                        <Route path={`${this.props.subRoute}/post`} component={() => <DirectPost />} />
                        <Route path={`${this.props.subRoute}/resume`} component={() => <Resume />} />
                        <Route path={`${this.props.subRoute}/contact`} component={() => <Contact />} />
                        <Route path={`${this.props.subRoute}/account`} component={() => <Account />} />
                        <Route path={`${this.props.subRoute}/api`} component={() => <ApiRedirect />} />
                        <Route component={() => <FourOhFour />} />
                    </Switch>
                </div>
                <Sidebar onRouteChange={this.redrawRouter} subRoute={this.props.subRoute} />
                <Footer />
            </div>
        );
    }
}

export default Main;