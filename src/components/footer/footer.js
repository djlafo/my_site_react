import React, { Component } from 'react';
import './footer.css';

class Footer extends Component {
    render() {
        return (
            <div className="footer">
                hosted on an AWS EC2 instance with continuous deployment using CodePipeline
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