import React, { Component } from 'react';
import './footer.css';

class Footer extends Component {
    render() {
        return (
            <div className="footer">
                Written in React; Hosted on AWS EC2 using CodePipeline
                <a target="_blank" 
                    rel="noopener noreferrer"
                    href="https://github.com/djlafo/my_site_react">
                    (source)
                </a>
            </div>
        );
    }
}

export default Footer;