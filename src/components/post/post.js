import React, { Component } from 'react';
import './post.css'

import Card from '../../components/card/card';
import UserLabel from '../../components/user-label/user-label';
import Ajax from '../../classes/ajax';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TrashIcon from './trash_icon.png';
import Moment from 'moment';

class Post extends Component {
    constructor(props) {
        super(props);
        this.deletePost = this.deletePost.bind(this);
    }

    deletePost() {
        Ajax.post(`${this.props.apiURL}/posts/delete`, {
            data: {
                id: this.props.post.id
            },
            headers: {
                Authorization: `Token ${this.props.user.token}`
            }
        }, (err, res, body) => {
            if(body && body.errors) {

            } else {
                this.props.postsUpdated();
            }
        });
    }

    render() {
        return <div className="post">
            <Card>
                <div>
                    <div className="header">
                        <div className="title">
                            {this.props.post.title}
                            &nbsp;
                            {
                                (this.props.user && this.props.user.role) === 'Admin' 
                                && <img src={TrashIcon} 
                                    className="trash-icon" 
                                    alt="Delete" 
                                    onClick={this.deletePost}/>
                            }
                        </div>
                        <div>
                            <UserLabel user={this.props.post.user} />
                            <br/>
                            <span className="date">
                                {Moment(this.props.post.date).format('MM/DD/YYYY hh:mm A')} -&nbsp;
                            </span>
                            <a target="_blank" rel="noopener" href={`/post/${this.props.post.id}`}>(Direct Link)</a>
                        </div>
                    </div>
                    <div className="body">
                        <ReactQuill value={this.props.post.body} modules={{toolbar: false}} readOnly/>
                    </div>
                </div>
            </Card>
        </div>
    }
}

export default Post;