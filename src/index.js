import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import './index.css'

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers.js';
import { BrowserRouter, Switch, Route } from "react-router-dom";

import WorkInProgress from './pages/work-in-progress/work-in-progress.js'
import Main from './pages/main/main.js'
import FourOhFour from './pages/four-oh-four/four-oh-four.js'

const store = createStore(rootReducer);

const routing = (
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route exact path="/workinprogress" component={() => (<WorkInProgress />)} />
                <Route path="/" component={() => (<Main subRoute=""/>)} />
                <Route component={() => <FourOhFour />} />
            </Switch>
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(routing,document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
