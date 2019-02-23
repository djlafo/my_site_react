import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './sidebar.css'

class Sidebar extends Component {
    render() {
        return (
            <div className="sidebar">
                <div className="links">
                    <ul>
                        <li>
                            <Link to={`${this.props.subRoute}/`}>Home</Link>
                        </li>
                        <li>
                            <Link to={`${this.props.subRoute}/contact`}>Contact</Link>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Sidebar;