import React, { Component } from 'react';
import './home.css'

import Card from '../../components/card/card.js';
import yup from '../../images/yup.png'

class Home extends Component {
    render() {
        return (
            <div className="home">
                <Card>
                    <div className="welcome-card">
                        Welcome<br/>
                        <br/>
                        The website is currently undergoing improvements;
                        Depending on my motivation at least
                        <br/>
                        <div className="img-container">
                            <a href={yup} 
                                target="_blank"
                                rel="noopener noreferrer"> 
                                <img className="framed" src={yup}/>
                            </a>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }
}

export default Home