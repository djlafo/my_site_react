import React, { Component } from 'react';
import './post-editor.css'

import Card from '../card/card';
import Ajax from '../../classes/ajax';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ImageResize } from 'quill-image-resize-module'

Quill.register('modules/imageResize', ImageResize);
Quill.register('attributors/style/size');

class PostEditor extends Component {

    modules = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{'color': []}, {'background': []}],
            [{'size': []}, {'header': []}, {'align': []}],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered'}, {'list': 'bullet'}],
            ['link', 'image', 'video'],
        ],
        imageResize: true
    }

    constructor(props) {
        super(props);
        this.state = {
            newPost: {
                title: '',
                body: ''
            },
            errorMessage: ''
        };
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleFormChange(e) {
        const name = (e.target) ? e.target.name : 'body';
        const value = (e.target) ? e.target.value : e;
        this.setState(state => {
            return {
                newPost: Object.assign(state.newPost, {[name]: value})
            };
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        Ajax.post(`${this.props.apiURL}/posts`, 
            {
                data: {post: this.state.newPost},
                headers: {Authorization: `Token ${this.props.user.token}`}
            }, (err,res,body) => {
            if(!body) {
                this.setState({
                    errorMessage: "Server did not respond"
                }); 
            } else if(body.errors) {
                this.setState({
                    errorMessage: `${body.errors.message}`
                });
            } else {
                this.setState({ 
                    newPost: {
                        title: '',
                        body: ''
                    }
                });
                this.props.postsUpdated(body);
            }
        });
    }
    
    render() {
        return <div className="post-editor">
            <Card>
                <form onSubmit={this.handleSubmit}>
                    <div className="header">
                        New Post
                    </div>
                    <div className="info">
                        <input name="title"
                            value={this.state.newPost.title}
                            required
                            onChange={this.handleFormChange}
                            placeholder="Title"/>
                    </div>
                    <div className="body">
                        <ReactQuill modules={this.modules}
                            name="body"
                            value={this.state.newPost.body}
                            required 
                            placeholder="Post content"
                            onChange={this.handleFormChange}/>
                    </div>
                    <input type="submit" value="submit" />
                </form>
            </Card>
        </div>
    }
}

export default PostEditor;