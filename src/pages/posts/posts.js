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
            posts: [
                {
                    author: {
                        displayName: "Dylan Lafont",
                        username: "admin",
                        role: "Admin"
                    },
                    title: "Testing 2",
                    date: "02/30/35",
                    text: "This is a test for the new post system"
                },
                {
                    author: {
                        displayName: "Dylan Lafont",
                        username: "admin",
                        role: "Admin"
                    },
                    title: "Testing",
                    date: "02/25/35",
                    text: "This is a test, ignore this"
                }
            ]
        };
    }

    componentDidMount() {
        Ajax.read(`${this.props.apiURL}/posts`, null, function(err, res, body) {
            console.log(body);
        });
    }

    render() {
        return (
            <div className="posts">
                <div>
                    {
                        (this.props.user && this.props.user.role) === 'Admin' && <PostEditor />
                    }
                    {
                        this.state.posts.map((post) => {
                            return <Post key={`${post.date}${post.title}`} 
                                        user={this.props.user} 
                                        post={post} />
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