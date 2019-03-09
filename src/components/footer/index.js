import React, { Component } from 'react';
import './footer.css';

class Footer extends Component {
    render() {
        return (
            <div className="footer">
                Stack: React & Express | Ops: CodePipeline to EC2&nbsp;
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