import React, { Component } from 'react';
import './home.css'

import Card from '../../components/card/card.js';
import ballin from '../../images/ballin.jpg'

class Home extends Component {
    render() {
        return (
            <div className="home">
                <div className="welcome-2-23-19">
                    <Card>
                        <div>
                            Welcome<br/>
                            <br/>
                            The website is currently undergoing improvements;
                            Depending on my motivation at least
                            <br/>
                            <div className="img-container">
                                <a href={ballin} 
                                    target="_blank"
                                    rel="noopener noreferrer"> 
                                    <img className="framed" src={ballin}/>
                                </a>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }
}

export default Home