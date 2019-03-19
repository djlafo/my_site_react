import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from '../../classes/cookies';

import Card from '../../components/card';

import './web-socket-panel.css';

import WebSocketClient from './web-socket-client';
import WebSocketChat from './web-socket-chat';
import AdminTargetCommands from './admin-target-commands';

class WebSocketPanel extends Component {
    constructor(props) {
        super(props);

        this.toggleConsole = this.toggleConsole.bind(this);
        this.admin = this.admin.bind(this);
        this.executeCommand = this.executeCommand.bind(this);
        this.chatWith = this.chatWith.bind(this);
        this.onSendMessage = this.onSendMessage.bind(this);
        this.isUnread = this.isUnread.bind(this);
        this.hasUnreadMessages = this.hasUnreadMessages.bind(this);
        this.exitChat = this.exitChat.bind(this);

        const ws = new WebSocketClient({
            URL: this.props.socketURL
        });
        ws.onClientMessage = this.onClientMessage.bind(this);
        ws.onClientListChange = this.onClientListChange.bind(this);
        ws.onAuthChange = this.onAuthChange.bind(this);
        this.state = {
            expanded: false,
            messages: {},
            clientList: [],
            selectedChatClient: null,
            authenticated: false,
            ws: ws
        };
        if (Notification && Notification.permission !== "granted")
            Notification.requestPermission();
    }

    componentDidMount() {
        if(this.state.ws.opened) {
            if (this.props.logoutPending) {
                this.state.ws.deauth();
                this.props.logout();
            } else if(this.props.user && !this.state.authenticated) {
                this.state.ws.auth(this.props.user.token);
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextState.ws.opened) {
            if (nextProps.logoutPending) {
                nextState.ws.deauth();
                nextProps.logout();
            } else if(nextProps.user && !nextState.authenticated) {
                nextState.ws.auth(nextProps.user.token);
            }
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

    chatWith(e) {
        const index = Number(e.target.dataset.index);
        if(e.target.dataset.type === 'clientList') {
            this.setState(state => {
                const read = Object.assign(state.messages);
                if(read[state.clientList[index].id]) {
                    read[state.clientList[index].id].unread = false;
                }
                return {
                    selectedChatClient: state.clientList[index],
                    messages: read
                };
            });
        } else {
            this.setState(state => {
                const read = Object.assign(state.messages);
                if(read[index]) {
                    read[index].unread = false;
                }
                return {
                    selectedChatClient: {id: index},
                    messages: read 
                };
            });
        }
    }

    onSendMessage(e) {
        this.addMessage({ me: true, message: e.msg });
    }

    onClientMessage(msg) {
        this.addMessage({ message: msg.msg, convo: msg.sender });
    }

    onClientListChange(list) {
        this.setState({ 
            clientList: list
        });
    }

    onAuthChange(auth) {
        this.setState({
            authenticated: auth
        });
    }

    addMessage({ convo, sender, me, message }) {
        this.setState(state => {
            const currentMessages = state.messages;
            let newMessages = Object.assign(currentMessages, {});
            let target, sndr = null;
            if(me) {
                target = state.selectedChatClient.id;
                state.ws.send({
                    type: 'client_message',
                    msg: message,
                    target: target
                });
            } else {
                target = convo;
                sndr = sender || convo;
            }
            if(!newMessages[target]) newMessages[target] = {messages: []};
            newMessages[target].messages.push({
                me: me, 
                sender: sndr,
                message: message
            });
            if(!newMessages[target].unread) {
                newMessages[target].unread = !me && (!state.selectedChatClient || state.selectedChatClient.id !== sndr);
            }
            return {messages: newMessages};
        });
    }

    isUnread(client) {
        return this.state.messages[client] && this.state.messages[client].unread;
    }

    hasUnreadMessages(messages) {
        return Object.keys(messages).some(mKey => {
            return messages[mKey].unread;
        });
    }

    exitChat() {
        this.setState({ 
            selectedChatClient: null
        });
    }

    executeCommand(msg) {
        this.state.ws.send(msg, {auth: true});
    }

    admin(user) {
        return user && user.role === 'Admin';
    }

    render() {
        return (
            <div className="web-socket-client">
                {
                    this.admin(this.props.user) &&
                    <input type="button"
                        value={`Toggle WSS Console (${this.state.clientList.length}) ${this.hasUnreadMessages(this.state.messages) ? '(New Messages)': ''}`} 
                        onClick={this.toggleConsole} />
                }
                {
                    !this.admin(this.props.user) &&
                    Object.keys(this.state.messages).length > 0 &&
                    <input type="button"
                        value={`Chat (${Object.keys(this.state.messages).length}) ${this.hasUnreadMessages(this.state.messages) ? '(New Messages)': ''}`}
                        onClick={this.toggleConsole} />
                }
                {
                    this.state.expanded && 
                    <Card>
                        <div>
                        {
                            (!this.state.selectedChatClient &&
                            this.state.selectedChatClient !== 0) 
                            ?
                            <div className="main-window">
                                {   this.admin(this.props.user) 

                                    ?

                                    this.state.clientList.map((client, ind) => {
                                        return <div key={`${client.id}${client.username}`}>
                                            {`${client.id}. ${client.ip || ''} ${client.username || ''}`}
                                            <input type="button"
                                                value="Chat"
                                                data-type="clientList"
                                                data-index={ind}
                                                onClick={this.chatWith} />
                                            <AdminTargetCommands client={client} onCommand={this.executeCommand}/>
                                            {
                                                this.isUnread(client.id) && 
                                                <span> New Messages </span>
                                            }
                                        </div>;
                                    })

                                    :

                                    Object.keys(this.state.messages).map((mKey, ind) => {
                                        return <div key={`${mKey}${ind}`}>
                                            {`${mKey}`}
                                            <input type="button"
                                                value="Chat"
                                                data-type="messages"
                                                data-index={mKey}
                                                onClick={this.chatWith} />
                                            {
                                                this.isUnread(mKey) && 
                                                <span> New Messages </span>
                                            }
                                        </div>;
                                    })
                                }
                            </div>
                            :
                            <WebSocketChat onSendMessage={this.onSendMessage} 
                                selectedChatClient={this.state.selectedChatClient}
                                messages={this.state.messages}
                                onExit={this.exitChat} />
                        }
                        </div>
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