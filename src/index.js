import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './index.css'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import WorkInProgress from './pages/work-in-progress/work-in-progress.js'
import Home from './pages/home/home.js'

const wip = () => (<WorkInProgress/>);
const homepage = () => (<Home/>);

const routing = (
    <Router>
        <div>    
            <Route exact path="/" component={wip} />
            <Route path="/home" component={homepage} />
        </div>
    </Router>
);

ReactDOM.render(routing,document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
