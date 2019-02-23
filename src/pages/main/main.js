import React, { Component } from 'react';
import './main.css';
import { Switch, Route } from "react-router-dom";
import Home from '../home/home.js';
import Contact from '../contact/contact.js';
import Sidebar from '../../components/sidebar/sidebar.js';
import Footer from '../../components/footer/footer.js';

class Main extends Component {
    render() {
        return (
            <div className="main">
                <div>
                    <div className="content">
                        <Switch>
                            <Route exact path={`${this.props.subRoute}/`} component={() => <Home />} />
                            <Route path={`${this.props.subRoute}/contact`} component={() => <Contact />} />
                        </Switch>
                    </div>
                    <Sidebar onRouteChange={this.redrawRouter} subRoute={this.props.subRoute}/>
                </div>
                <Footer />
            </div>
        );
    }
}

export default Main;