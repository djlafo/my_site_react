import React, { Component } from 'react';
import './resume.css';

import Card from '../../components/card/card.js'
import resumepdf from './resume.pdf'

class Resume extends Component {
    render() {
        return (
            <div className="resume">
                <Card>
                    Work in Progress
                    <a href={resumepdf} download>(Download)</a>
                    <br />
                    <embed src={resumepdf} type="application/pdf" />
                </Card>
            </div>
        );
    }
}

export default Resume;