import React, { Component } from 'react';

class WebSocketChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedChatClient: null,
            chatInput: '',
            messages: {},
            unread: [],
        };
        this.exitChat = this.exitChat.bind(this);
        this.sendChatMessage = this.sendChatMessage.bind(this);
        this.updateChatInput = this.updateChatInput.bind(this);
    }

    addMessage(chatTarget, message) {
        let newMessages = Object.assign(this.props.messages);
        if(!newMessages[chatTarget]) newMessages[chatTarget] = [];
        newMessages[chatTarget].push(message);
        let newState = {
            messages: newMessages
        };
        let sender = Number(message.sender);
        if(!message.me && !this.state.unread.find(person => person === sender) && this.props.selectedChatClient !== sender) {
            newState.unread = this.state.unread.concat(sender);
        }
        this.setState(newState);
    }
    
    
    exitChat() {
        this.props.onExit();
    }

    updateChatInput(e) {
        this.setState({
            chatInput: e.target.value
        });
    }

    sendChatMessage(e) {
        e.preventDefault();
        this.addMessage(this.props.selectedChatClient, {
            msg: this.state.chatInput,
            me: true
        });
        this.sendMessage({
            type: 'client_message',
            target: this.props.selectedChatClient,
            msg: this.state.chatInput
        }, {});
        this.setState({
            chatInput: ''
        });
    }

    render() {
        return <div className='web-socket-chat'>
            {
                (this.props.selectedChatClient || this.props.selectedChatClient === 0) &&
                <div className="chat-window">
                    <input type="button"
                        onClick={this.exitChat}
                        value="Back" />
    
                    {
                        this.props.messages[this.props.selectedChatClient] &&
                        this.props.messages[this.props.selectedChatClient].map((message, ind) => {
                            return <div className="chat-message" key={`${message.msg}${ind}`}>
                                {    
                                    message.me ? 
                                    <div className='my-message'>
                                        {message.msg}
                                    </div>
                                    :
                                    <div className='other-message'>
                                        {this.props.selectedChatClient}<br/>
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

export default WebSocketChat;