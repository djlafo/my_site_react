import React, { Component } from 'react';
import './main.css';
import { Switch, Route } from "react-router-dom";

import Home from '../home/home';
import Contact from '../contact/contact';
import Resume from '../resume/resume';
import Account from '../account/account';
import FourOhFour from '../four-oh-four/four-oh-four'

import Sidebar from '../../components/sidebar/sidebar';
import Footer from '../../components/footer/footer';
import Topbar from '../../components/topbar/topbar';

class Main extends Component {
    render() {
        return (
            <div className="main">
                <div className="content">
                    <Topbar subRoute={this.props.subRoute} />
                    <Switch>
                        <Route exact path={`${this.props.subRoute}/`} component={() => <Home />} />
                        <Route path={`${this.props.subRoute}/resume`} component={() => <Resume />} />
                        <Route path={`${this.props.subRoute}/contact`} component={() => <Contact />} />
                        <Route path={`${this.props.subRoute}/account`} component={() => <Account />} />
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