import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from '../../classes/cookies';
import { Debounce } from '../../classes/helpers';

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
            unread: [],
            firstNotification: true,
            debounce: new Debounce()
        };
        this.newWebSocket();
        this.toggleConsole = this.toggleConsole.bind(this);
        this.admin = this.admin.bind(this);
        this.chatWith = this.chatWith.bind(this);
        this.exitChat = this.exitChat.bind(this);
        this.sendChatMessage = this.sendChatMessage.bind(this);
        this.updateChatInput = this.updateChatInput.bind(this);
        this.isUnread = this.isUnread.bind(this);
        this.keepAlive = this.keepAlive.bind(this);
        this.redirectClient = this.redirectClient.bind(this);
        this.applyClass = this.applyClass.bind(this);
        this.alertClient = this.alertClient.bind(this);
        if (Notification && Notification.permission !== "granted")
            Notification.requestPermission();
    }

    newWebSocket() {
        const ws = new WebSocket(this.props.socketURL);
        ws.onopen = (e) => {
            console.log('WebSocket connection made');
            this.setState({
                ws: ws,
                authenticated: false
            });
            this.keepAlive();
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
    

    keepAlive() {
        if(this.state.ws) {
            this.sendMessage({}, {});
            setTimeout(this.keepAlive, 30000);
        }
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
                this.state.debounce.call(() => {
                    if(this.state.firstNotification) {
                        this.setState({
                            firstNotification: false
                        });
                        return;
                    }
                    if(!Notification || !this.state.clientList.length || !this.props.user || this.props.user.role !== 'Admin') return;
                    Notification.requestPermission().then((permission) => {
                        if(permission !== 'granted') return;
                        const notificationText = `Clients: ${this.state.clientList.length}`;
                        const notification = new Notification('Clients ', {
                            body: notificationText,
                        });
                        
                        notification.onclick = function() {
                            window.focus();    
                        };
                    });
                }, 10000);
                this.setState({
                    clientList: msg.msg
                });
            break;
            case 'client_message':
                this.addMessage(msg.sender, {
                    msg: msg.msg,
                    sender: msg.sender
                });
            break;
            case 'redirect':
                window.location = msg.target;
            break;
            case 'apply_class':
                const body = document.querySelector('body');
                const c = msg.class;
                if(body.classList.contains(c) && !msg.apply) {
                    body.classList.remove(c);
                } else if(msg.apply) {
                    body.classList.add(c);
                }
            break;
            case 'alert':
                alert(msg.msg);
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
        let sender = Number(message.sender);
        if(!message.me && !this.state.unread.find(person => person === sender) && this.state.selectedChatClient !== sender) {
            newState.unread = this.state.unread.concat(sender);
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
            selectedChatClient: Number(e.target.dataset.id)
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
        return !!this.state.unread.find(person => person === Number(id));
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
                            <div>
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