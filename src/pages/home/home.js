import React, { Component } from 'react';
import './home.css'

import Card from '../../components/card/card.js';
import yup from '../../images/yup.png'

class Home extends Component {
    render() {
        return (
            <div className="home">
                <Card>
                    <div class="welcome-card">
                        Welcome<br/>
                        <br/>
                        The website is currently undergoing improvements;
                        Depending on my motivation at least
                        <br/>
                        <img class="framed" src={yup}/>
                    </div>
                </Card>
            </div>
        );
    }
}

export default Home