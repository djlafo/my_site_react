import React, { Component } from 'react';

class WebSocketChat extends Component {
    constructor() {
        this.state = {
            selectedChatClient: null,
            chatInput: '',
            messages: {},
            unread: [],
        };
        this.chatWith = this.chatWith.bind(this);
        this.exitChat = this.exitChat.bind(this);
        this.sendChatMessage = this.sendChatMessage.bind(this);
        this.updateChatInput = this.updateChatInput.bind(this);
        this.isUnread = this.isUnread.bind(this);
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

    isUnread(id) {
        return !!this.state.unread.find(person => person === Number(id));
    }

    render() {
        return <div className='web-socket-chat'>
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
        </div>
    }
}