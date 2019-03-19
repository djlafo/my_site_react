import React, { Component } from 'react';

class WebSocketChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedChatClient: null,
            chatInput: ''
        };
        this.exitChat = this.exitChat.bind(this);
        this.sendChatMessage = this.sendChatMessage.bind(this);
        this.updateChatInput = this.updateChatInput.bind(this);
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
        this.setState((state, props) => {
            props.onSendMessage({
                msg: state.chatInput
            });
            return {chatInput: ''};
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
                    <div className="chat-messages">
                        {
                            this.props.messages[this.props.selectedChatClient.id] &&
                            this.props.messages[this.props.selectedChatClient.id].messages.map((message, ind) => {

                                return <div className="chat-message" key={`${message.message}${ind}`}>
                                    {    
                                        message.me ? 
                                        <div className='my-message'>
                                            {message.message}
                                        </div>
                                        :
                                        <div className='other-message'>
                                            {message.sender}<br/>
                                            {message.message}
                                        </div>
                                    }
                                </div>;
                            })
                        }
                    </div>
    
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