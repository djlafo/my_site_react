import React, { Component } from 'react';
import './contact.css';

import Card from '../../components/card';

class Contact extends Component {
    render() {
        return (
            <div className="contact">
                <Card>
                    <div>
                        My Links:<br/>
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
                        <br/>
                        Contact me
                        <br/>
                        Email: <a href="mailto:me@dylanlafont.com">me@dylanlafont.com</a>
                    </div>
                </Card>
            </div>
        );
    }
}

export default Contact;