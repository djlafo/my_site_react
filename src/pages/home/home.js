import React, { Component } from 'react';
import './home.css'

import Posts from '../posts/posts';

class Home extends Component {
    render() {
        return (
            <div className="home">
                <Posts />
            </div>
        );
    }
}

export default Home