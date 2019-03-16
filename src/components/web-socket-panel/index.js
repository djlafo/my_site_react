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
        this.state = {
            expanded: false,
            messages: {},
            selectedChatClient: null
        };
        this.ws = new WebSocketClient({
            URL: this.props.socketURL
        });
        this.toggleConsole = this.toggleConsole.bind(this);
        this.admin = this.admin.bind(this);
        this.executeCommand = this.executeCommand.bind(this);
        this.chatWith = this.chatWith.bind(this);
        this.onSendMessage = this.onSendMessage.bind(this);
        this.isUnread = this.isUnread.bind(this);
        this.hasUnreadMessages = this.hasUnreadMessages.bind(this);
        this.exitChat = this.exitChat.bind(this);
        if (Notification && Notification.permission !== "granted")
            Notification.requestPermission();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.ws.opened) {
            if (nextProps.logoutPending) {
                this.ws.deauth();
                nextProps.logout();
            } else if(nextProps.user && !this.ws.authenticated) {
                this.ws.auth(nextProps.user.token);
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
        if(e.target.dataset.type === 'clientList') {
            this.setState({
                selectedChatClient: this.ws.clientList[e.target.dataset.index]
            });
        }
    }

    onSendMessage(e) {

    }

    isUnread(client) {
        return messages[client].unread;
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
        this.ws.send(msg, {auth: true});
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
                        value={`Toggle WSS Console (${this.ws.clientList.length}) ${this.hasUnreadMessages(this.state.messages) ? '(New Messages)': ''}`} 
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
                        {
                            (!this.state.selectedChatClient &&
                            this.state.selectedChatClient !== 0) 
                            ?
                            <div className="main-window">
                                {   this.admin(this.props.user) 

                                    ?

                                    this.ws.clientList.map((client, ind) => {
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

                                    Object.keys(this.state.messages).map(m => {
                                        {/* return <div key={`${client.id}${client.username}`}>
                                            {`${client.id}. ${client.username || ''}`}
                                            <input type="button"
                                                value="Chat"
                                                data-type="messages"
                                                data-id={m}
                                                onClick={this.chatWith} />
                                            {
                                                this.isUnread(client.id) && 
                                                <span> New Messages </span>
                                            }
                                        </div>; */}
                                    })
                                }
                            </div>
                            :
                            <WebSocketChat onSendMessage={this.onSendMessage} 
                                selectedChatClient={this.state.selectedChatClient}
                                messages={this.state.messages}
                                onExit={this.exitChat} />
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