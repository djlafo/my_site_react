import React, { Component } from 'react';
import { connect } from 'react-redux';
import './posts.css';

import Post from '../../components/post';
import PostEditor from '../../components/post-editor';
import 'react-quill/dist/quill.snow.css';
import Card from '../../components/card'
import Ajax from '../../classes/ajax';

class Posts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            errorLoading: false
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
        Ajax.read(`${this.props.apiURL}/posts`, {}, (res) => {
            this.setState({
                posts: res,
                errorLoading: false
            });
        }, () => {
            this.setState({
                errorLoading: true
            });
        });
    }

    render() {
        return (
            <div className="posts">
                <div>
                    {
                        this.state.errorLoading && 
                        <div className="error-card">
                            <Card>
                                Error Loading Posts
                            </Card>
                        </div> 
                    }
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