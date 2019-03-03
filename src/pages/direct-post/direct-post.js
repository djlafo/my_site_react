import React, { Component } from 'react';
import { connect } from 'react-redux';
import './direct-post.css'

import Ajax from '../../classes/ajax';
import Post from '../../components/post/post';
import createHistory from 'history/createBrowserHistory';

class DirectPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post: {}
        };
        this.postsUpdated = this.postsUpdated.bind(this);
        this.history = createHistory();
    }

    postsUpdated() {
        // redirect to home ( and maybe just refresh )
    }

    componentDidMount() {
        const url = window.location.href.split('post/');
        if(url.length > 1) {
            Ajax.read(`${this.props.apiURL}/posts/${url[1]}`, null,
                (err, res, body) => {
                    if(body && !body.error) {
                        this.setState({
                            post: body
                        });
                    }
                }
            );
        }
    }

    render() {
        return (
            <div className="direct-post">
                <Post post={this.state.post} 
                    user={this.props.user}
                    apiURL={this.props.apiURL}
                    postsUpdated={this.postsUpdated} />
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