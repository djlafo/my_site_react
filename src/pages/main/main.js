import React, { Component } from 'react';
import './main.css';
import { Switch, Route } from "react-router-dom";

import Home from '../home/home.js';
import Contact from '../contact/contact.js';
import Resume from '../resume/resume.js';

import Sidebar from '../../components/sidebar/sidebar.js';
import Footer from '../../components/footer/footer.js';
import Topbar from '../../components/topbar/topbar.js';

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
                    </Switch>
                </div>
                <Sidebar onRouteChange={this.redrawRouter} subRoute={this.props.subRoute} />
                <Footer />
            </div>
        );
    }
}

export default Main;