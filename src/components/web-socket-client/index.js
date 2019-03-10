import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from '../../classes/cookies';

import Card from '../../components/card';

import './web-socket-client.css';

class WebSocketClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ws: null,
            clientList: [],
            authenticated: false,
            expanded: false,
            selectedChatClient: null,
            chatInput: '',
            messages: {},
            unread: []
        };
        this.newWebSocket();
        this.toggleConsole = this.toggleConsole.bind(this);
        this.admin = this.admin.bind(this);
        this.chatWith = this.chatWith.bind(this);
        this.exitChat = this.exitChat.bind(this);
        this.sendChatMessage = this.sendChatMessage.bind(this);
        this.updateChatInput = this.updateChatInput.bind(this);
        this.isUnread = this.isUnread.bind(this);
    }

    newWebSocket() {
        const ws = new WebSocket(this.props.socketURL);
        ws.onopen = (e) => {
            console.log('WebSocket connection made');
            this.setState({
                ws: ws,
                authenticated: false
            });
        };
        ws.onclose = (e) => {
            console.log('WebSocket connection closed');
            this.setState({
                ws: null,
                authenticated: false
            });
            setTimeout(() => {
                console.log('Attempting reconnect...');
                this.newWebSocket();
            }, 5000);
        };
        ws.onerror = (e) => {
            console.error('WebSocket error: ', e.message);
        };
        ws.onmessage = this.handleMessage.bind(this);
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

    handleMessage(e) {
        const msg = JSON.parse(e.data);
        switch(msg.type) {
            case 'info':
                console.log(msg.msg);
            break;
            case 'client_list':
                console.log('new client list:', msg.msg); 
                this.setState({
                    clientList: msg.msg
                });
            break;
            case 'client_message':
                console.log('Client message received: ', msg);
                this.addMessage(msg.sender, {
                    msg: msg.msg,
                    sender: msg.sender
                });
            break;
            default: 
                console.log('Unhandled WS message type: ' + msg.type);
            break;
        }
    }

    addMessage(chatTarget, message) {
        let newMessages = Object.assign(this.state.messages);
        if(!newMessages[chatTarget]) newMessages[chatTarget] = [];
        newMessages[chatTarget].push(message);
        let newState = {
            messages: newMessages
        };
        if(!message.me && !this.state.unread.find(person => message.sender) && this.state.selectedChatClient !== message.sender) {
            newState.unread = this.state.unread.concat(message.sender);
        }
        this.setState(newState);
    }

    sendMessage(json, { ws }) {
        if(ws) {
            ws.send(JSON.stringify(json));
        } else {
            this.state.ws.send(JSON.stringify(json));
        }
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

    chatWith(e) {
        let newState = {
            selectedChatClient: e.target.dataset.id
        };
        let ind = this.state.unread.findIndex(person => person === e.target.dataset.id);
        if(ind || ind === 0) {
            newState.unread = Array.from(this.state.unread);
            newState.unread.splice(ind, 1);
        }
        this.setState(newState);
    }

    exitChat() {
        this.setState({
            selectedChatClient: null
        });
    }

    updateChatInput(e) {
        this.setState({
            chatInput: e.target.value
        });
    }

    sendChatMessage(e) {
        e.preventDefault();
        this.addMessage(this.state.selectedChatClient, {
            msg: this.state.chatInput,
            me: true
        });
        this.sendMessage({
            type: 'client_message',
            target: this.state.selectedChatClient,
            msg: this.state.chatInput
        }, {});
        this.setState({
            chatInput: ''
        });
    }

    isUnread(id) {
        return !!this.state.unread.find(person => person === id);
    }

    render() {
        return (
            <div className="web-socket-client">
                {
                    this.admin(this.props.user) &&
                    <input type="button"
                        value={`Toggle WSS Console ${this.state.unread.length > 0 ? '(New Messages)': ''}`} 
                        onClick={this.toggleConsole} />
                }
                {
                    !this.admin(this.props.user) &&
                    <input type="button"
                        value={`Chat ${this.state.unread.length > 0 ? '(New Messages)': ''}`}
                        onClick={this.toggleConsole} />
                }
                {
                    this.state.expanded && 
                    <Card>
                        {
                            !this.state.selectedChatClient &&
                            this.state.selectedChatClient !== 0 &&
                            <div>
                                {
                                    this.state.clientList.map(client => {
                                        return <div key={`${client.id}${client.username}`}>
                                            {`${client.id}. ${client.ip || ''} ${client.username || ''}`}
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
                        {
                            (this.state.selectedChatClient || this.state.selectedChatClient === 0) &&
                            <div className="chat-window">
                                <input type="button"
                                    onClick={this.exitChat}
                                    value="Back" />

                                {
                                    this.state.messages[this.state.selectedChatClient] &&
                                    this.state.messages[this.state.selectedChatClient].map((message, ind) => {
                                        return <div className="chat-message" key={`${message.msg}${ind}`}>
                                            {    
                                                message.me ? 
                                                <div className='my-message'>
                                                    {message.msg}
                                                </div>
                                                :
                                                <div className='other-message'>
                                                    {this.state.selectedChatClient}<br/>
                                                    {message.msg}
                                                </div>
                                            }
                                        </div>;
                                    })
                                }

                                <form onSubmit={this.sendChatMessage}>
                                    <input type="text"
                                        required 
                                        value={this.state.chatInput}
                                        onChange={this.updateChatInput}
                                        placeholder="Chat here" />
                                    <input type="submit"
                                        value="Enter" />
                                </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(WebSocketClient);