import React, { Component } from 'react';
import './topbar.css';
import { Link } from "react-router-dom";

class Topbar extends Component {
    render() {
        return (
            <div className="topbar">
                <Link to={`${this.props.subRoute}/`}>Home</Link>
                <Link to={`${this.props.subRoute}/resume`}>Resumé</Link>
                <Link to={`${this.props.subRoute}/contact`}>Contact</Link>
            </div>
        );
    }
}

export default Topbar;