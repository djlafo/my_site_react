import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import * as serviceWorker from './serviceWorker';

const wip = (
    <div>
        <h1> 
            This page is a work in progress
        </h1>
        <h3>
            hosted on an AWS EC2 instance<br/>
            <a href="https://github.com/djlafo/my_site_react">source</a>
        </h3>
        <h4>
            My links:<br/>
            <a href="https://github.com/djlafo">GitHub</a><br/>
            <a href="https://www.linkedin.com/in/dylan-lafont-99a58a150/">Linkedin</a>
        </h4>
    </div>
);

ReactDOM.render(wip,document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
