import React, { Component } from 'react';
import './footer.css';

class Footer extends Component {
    render() {
        return (
            <div className="footer">
                Written in React & Express(Node); Hosted on AWS EC2 w/ CodePipeline
                <a target="_blank" 
                    rel="noopener noreferrer"
                    href="https://github.com/djlafo/">
                    (source)
                </a>
            </div>
        );
    }
}

export default Footer;