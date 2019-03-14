import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from '../../classes/cookies';
import { Debounce } from '../../classes/helpers';

import WebSocketClient from './web-socket-client';
import Card from '../../components/card';

import './web-socket-panel.css';
import WebSocketClient from './web-socket-client';

class WebSocketPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ws: new WebSocketClient({
                URL: this.props.socketURL
            }),
            expanded: false,
            firstNotification: true,
            debounce: new Debounce()
        };
        this.toggleConsole = this.toggleConsole.bind(this);
        this.admin = this.admin.bind(this);
        this.redirectClient = this.redirectClient.bind(this);
        this.applyClass = this.applyClass.bind(this);
        this.alertClient = this.alertClient.bind(this);
        if (Notification && Notification.permission !== "granted")
            Notification.requestPermission();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.logoutPending) {
            this.sendMessage({
                token: nextProps.user.token,
                type: 'deauth'
            }, {});
            this.setState({ 
                clientList: [],
                authenticated: false
            });
            nextProps.logout();
        } else if(nextState.ws && nextProps.user && !nextState.authenticated) {
            this.sendMessage({
                token: nextProps.user.token,
                type: 'auth'
            }, {ws: nextState.ws});
            this.setState({
                authenticated: true
            });
        }
        return true;
    }

    toggleConsole() {
        this.setState(state => {
            return {
                expanded: !state.expanded
            };
        })
    }

    admin(user) {
        return user && user.role === 'Admin';
    }

    redirectClient(e) {
        let target = prompt('Enter URL');
        if(!target) return;
        let client = e.target.dataset.id;
        this.sendMessage({
            type: 'redirect',
            client: client,
            target: target,
            token: this.props.user.token
        }, {});
    }

    applyClass(e) {
        this.sendMessage({
            type: 'apply_class',
            class: e.target.dataset.class,
            client: e.target.dataset.id,
            token: this.props.user.token,
            apply: e.target.value === e.target.dataset.regText
        }, {});
        e.target.value = e.target.value === e.target.dataset.regText ? e.target.dataset.altText : e.target.dataset.regText;
    }

    alertClient(e) {
        let msg = prompt('Enter message');
        this.sendMessage({
            type: 'alert',
            client: e.target.dataset.id,
            msg: msg,
            token: this.props.user.token
        }, {});
    }

    render() {
        return (
            <div className="web-socket-client">
                {
                    this.admin(this.props.user) &&
                    <input type="button"
                        value={`Toggle WSS Console  (${this.state.clientList.length}) ${this.state.unread.length > 0 ? '(New Messages)': ''}`} 
                        onClick={this.toggleConsole} />
                }
                {
                    !this.admin(this.props.user) &&
                    Object.keys(this.state.messages).length > 0 &&
                    <input type="button"
                        value={`Chat (${Object.keys(this.state.messages).length}) ${this.state.unread.length > 0 ? '(New Messages)': ''}`}
                        onClick={this.toggleConsole} />
                }
                {
                    this.state.expanded && 
                    <Card>
                        {
                            !this.state.selectedChatClient &&
                            this.state.selectedChatClient !== 0 &&
                            <div className="main-window">
                                {   this.admin(this.props.user) && 
                                    this.state.clientList.map(client => {
                                        return <div key={`${client.id}${client.username}`}>
                                            {`${client.id}. ${client.ip || ''} ${client.username || ''}`}
                                            <input type="button"
                                                value="Chat"
                                                data-id={client.id}
                                                onClick={this.chatWith} />
                                            <input type="button"
                                                value="Redirect"
                                                data-id={client.id}
                                                onClick={this.redirectClient} />
                                            <input type="button"
                                                value="Flip Vertical"
                                                data-reg-text="Flip Vertical"
                                                data-alt-text="Unflip Vertical"
                                                data-class="flip-vertical"
                                                data-id={client.id}
                                                onClick={this.applyClass} />
                                            <input type="button"
                                                value="Tinify"
                                                data-reg-text="Tinify"
                                                data-alt-text="Un-Tinify"
                                                data-class="tiny"
                                                data-id={client.id}
                                                onClick={this.applyClass} />
                                            <input type="button"
                                                value="Alert"
                                                data-id={client.id}
                                                onClick={this.alertClient} />
                                            {
                                                this.isUnread(client.id) && 
                                                <span> New Messages </span>
                                            }
                                        </div>;
                                    })
                                }
                                {   !this.admin(this.props.user) && 
                                    Object.keys(this.state.messages).map(m => {
                                        const client = this.state.clientList.find(c => c.id = m);
                                        return <div key={`${client.id}${client.username}`}>
                                            {`${client.id}. ${client.username || ''}`}
                                            <input type="button"
                                                value="Chat"
                                                data-id={client.id}
                                                onClick={this.chatWith} />
                                            {
                                                this.isUnread(client.id) && 
                                                <span> New Messages </span>
                                            }
                                        </div>;
                                    })
                                }
                            </div>
                        }
                    </Card>
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        socketURL: state.socketURL,
        user: state.user,
        logoutPending: state.logoutPending
    };
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => {
            Cookies.removeAllCookies();
            dispatch({type: 'update_user', data: null})
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(WebSocketPanel);