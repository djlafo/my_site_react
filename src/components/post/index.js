import React, { Component } from 'react';
import './post.css'

import Card from '../../components/card';
import UserLabel from '../user-label';
import Ajax from '../../classes/ajax';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TrashIcon from '../../images/trash_icon.png';
import EditIcon from '../../images/edit_icon.png';
import SaveIcon from '../../images/save_icon.png';
import Moment from 'moment';

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            body: props.post.body
        };
        this.deletePost = this.deletePost.bind(this);
        this.editPost = this.editPost.bind(this);
        this.saveEdit = this.saveEdit.bind(this);
    }

    deletePost() {
        Ajax.post(`${this.props.apiURL}/posts/delete`, {
            data: {
                id: this.props.post.id
            },
            auth: this.props.user.token
        }, (res) => {
            this.props.postsUpdated();
        });
    }

    editPost() {
        this.setState({ 
            editing: true
        });
    }

    saveEdit() {
        this.setState({ 
            editing: false
        });
        Ajax.post(`${this.props.apiURL}/posts/${this.props.post.id}`, {
            data: {
                body: this.state.body
            },
            auth: this.props.user.token
        });
    }

    render() {
        return <div className="post" readOnly={!this.state.editing}>
            <Card>
                <div>
                    <div className="header">
                        <div className="title">
                            <span>
                                {this.props.post.title}
                            </span>
                            &nbsp;
                            {
                                (this.props.user && this.props.user.role) === 'Admin' 
                                && <span>
                                        {this.state.editing ? 
                                        <img src={SaveIcon}
                                            className="save-icon"
                                            alt="Save"
                                            onClick={this.saveEdit} />
                                            :
                                        <img src={EditIcon}
                                            className="edit-icon"
                                            alt="Edit"
                                            onClick={this.editPost} />
                                        }
                                        <img src={TrashIcon} 
                                            className="trash-icon" 
                                            alt="Delete" 
                                            onClick={this.deletePost}/>
                                    </span>
                            }
                        </div>
                        <div className="details">
                            <UserLabel user={this.props.post.user} />
                            <br/>
                            <span className="date">
                                {Moment(this.props.post.date).format('MM/DD/YYYY ddd hh:mm A')} -&nbsp;
                            </span>
                            <a target="_blank" rel="noopener noreferrer" href={`/post/${this.props.post.id}`}>(Direct Link)</a>
                        </div>
                    </div>
                    <div className="body">
                        <ReactQuill value={this.state.body} modules={{toolbar: this.state.editing}} readOnly={!this.state.editing}/>
                    </div>
                </div>
            </Card>
        </div>
    }
}

export default Post;