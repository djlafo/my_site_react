import React, { Component } from 'react';
import './post.css'

import Card from '../../components/card/card';
import UserLabel from '../../components/user-label/user-label';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TrashIcon from './trash_icon.png';

class Post extends Component {
    render() {
        return <div className="post">
            <Card>
                <div>
                    <div className="header">
                        <div className="title">
                            {this.props.post.title}
                            &nbsp;
                            {
                                (this.props.user && this.props.user.role) === 'Admin' && <img src={TrashIcon} className="trash-icon" alt="Delete" />
                            }
                        </div>
                        <div>
                            <span className="date">
                                {this.props.post.date} -&nbsp;
                            </span>
                            <UserLabel user={this.props.post.author} />
                        </div>
                    </div>
                    <div className="body">
                        <ReactQuill value={this.props.post.text} modules={{toolbar: false}} readOnly/>
                    </div>
                </div>
            </Card>
        </div>
    }
}

export default Post;