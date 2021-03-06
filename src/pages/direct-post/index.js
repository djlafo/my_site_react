import React, { Component } from 'react';
import { connect } from 'react-redux';
import './direct-post.css'

import Ajax from '../../classes/ajax';
import Post from '../../components/post';
import Card from '../../components/card';

class DirectPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post: null,
            errorLoading: false
        };
        this.postsUpdated = this.postsUpdated.bind(this);
    }

    postsUpdated() {
        // redirect to home ( and maybe just refresh )
    }

    componentDidMount() {
        const url = window.location.href.split('post/');
        if(url.length > 1) {
            Ajax.read(`${this.props.apiURL}/posts/${url[1]}`, {},
                (res) => {
                    this.setState({
                        post: res
                    });
                },
                () => {
                    this.setState({
                        errorLoading: true
                    });
                }
            );
        }
    }

    render() {
        return (
            <div className="direct-post">
                {
                this.state.errorLoading
                ?
                <div className="error-card">
                    <Card>
                        Post does not exist or connection failed
                    </Card>
                </div>
                :
                    this.state.post && 
                    <Post post={this.state.post || {}} 
                        user={this.props.user}
                        apiURL={this.props.apiURL}
                        postsUpdated={this.postsUpdated} />
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        apiURL: state.apiURL
    };
}

export default connect(mapStateToProps)(DirectPost);