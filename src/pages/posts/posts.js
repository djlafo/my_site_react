import React, { Component } from 'react';
import { connect } from 'react-redux';
import './posts.css';

import Post from '../../components/post/post';
import PostEditor from '../../components/post-editor/post-editor';
import 'react-quill/dist/quill.snow.css';
import Ajax from '../../classes/ajax';

class Posts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            posts: []
        };
        this.postsUpdated = this.postsUpdated.bind(this);
    }

    postsUpdated(newPost) {
        this.readPosts();
    }

    componentDidMount() {
        this.readPosts();
    }

    readPosts() {
        Ajax.read(`${this.props.apiURL}/posts`, null, (err, res, body) => {
            if(body) {
                this.setState({
                    posts: body
                });
            }
        });
    }

    render() {
        return (
            <div className="posts">
                <div>
                    {
                        (this.props.user && this.props.user.role) === 'Admin' 
                        && <PostEditor postsUpdated={this.postsUpdated}
                            apiURL={this.props.apiURL}
                            user={this.props.user}/>
                    }
                    {
                        this.state.posts.map((post) => {
                            return <Post key={`${post.date}${post.title}`} 
                                        post={post} 
                                        user={this.props.user}
                                        apiURL={this.props.apiURL}
                                        postsUpdated={this.postsUpdated} />
                        })
                    }
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        apiURL: state.apiURL,
        user: state.user
    }
}

export default connect(mapStateToProps)(Posts);