import React, { Component } from 'react';
import './work-in-progress.css'

class WorkInProgress extends Component {
    render() {
        return (<div className="work-in-progress">
            <h1> 
                This page is a work in progress
            </h1>
            <h3>
                hosted on an AWS EC2 instance with continuous deployment using CodePipeline<br/>
                <a target="_blank" 
                    rel="noopener noreferrer"
                    href="https://github.com/djlafo/my_site_react">
                    source
                </a>
            </h3>
            <h4>
                My links:<br/>
                <a target="_blank" 
                    rel="noopener noreferrer"
                    href="https://github.com/djlafo">
                    GitHub
                </a>
                <br/>
                <a target="_blank" 
                    rel="noopener noreferrer"
                    href="https://www.linkedin.com/in/dylan-lafont-99a58a150/">
                    Linkedin
                </a>
                <br/>
                Contact me
                <br/>
                Email: <a href="mailto:me@dylanlafont.com">me@dylanlafont.com</a>
            </h4>
        </div>);
    }
}

export default WorkInProgress