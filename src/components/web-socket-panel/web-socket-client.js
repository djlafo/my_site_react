class WebSocketClient {
    constructor({ URL }) {
        this.clientList = [];
        this.socket = new WebSocket(URL);
        ws.onopen = this._onOpen,
        ws.onclose = this._onClose,
        ws.onerror = (e) => {
            console.error('WebSocket error: ', e.message);
        };
        ws.onmessage = this._onMessage
    }

    _onOpen(e) {
        console.log('WebSocket connection made');
        this.setState({
            ws: ws,
            authenticated: false
        });
        this.keepAlive();
    }

    keepAlive() {
        if(this.socket) {
            this.send({}, {});
            setTimeout(this.keepAlive, 30000);
        }
    }

    _onClose(e) {
        console.log('WebSocket connection closed');
        this.socket = null;
        this.authenticated = false;
        setTimeout(() => {
            console.log('Attempting reconnect...');
            this.newWebSocket();
        }, 5000);
    }

    _onMessage(e) {
        const msg = JSON.parse(e.data);
        switch(msg.type) {
            case 'info':
                console.log(`SERVER INFO: ${msg.msg}`);
            break;
            case 'client_list':
                this.clientList = msg.msg;
            break;
            case 'client_message':
                this.onClientMessage(msg);
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

    send(tar, msg) {

    }
}

export default WebSocketClient;