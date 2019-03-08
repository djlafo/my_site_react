import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import './index.css'

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers';
import { BrowserRouter, Switch, Route } from "react-router-dom";

import WorkInProgress from './pages/work-in-progress';
import Main from './pages/main';
import Cookies from './classes/cookies';

const initUser = Cookies.getCookie('user');
const store = createStore(rootReducer, {user: initUser && JSON.parse(initUser || {})});

const routing = (
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route exact path="/workinprogress" component={() => (<WorkInProgress />)} />
                <Route path="/" component={() => (<Main subRoute=""/>)} />
            </Switch>
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(routing,document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
