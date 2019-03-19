class WebSocketClient {
    constructor({ URL }) {
        this.URL = URL;
        this.clear();
        this.reconnect();
    }

    clear() {
        this.token = null;
        if(this.onAuthChange) this.onAuthChange(false);
    }

    reconnect() {
        this.socket = new WebSocket(this.URL);
        this.socket.onopen = this._onOpen.bind(this);
        this.socket.onclose = this._onClose.bind(this);
        this.socket.onerror = (e) => {
            console.error('WebSocket error: ', e.message);
        };
        this.socket.onmessage = this._onMessage.bind(this);
    }

    _onOpen(e) {
        console.log('WebSocket connection made');
        this.clear();
        this.keepAlive();
    }

    keepAlive() {
        if(this.opened) {
            this.send({}, {});
            setTimeout(this.keepAlive, 30000);
        }
    }

    _onClose(e) {
        console.log('WebSocket connection closed');
        this.clear();
        setTimeout(() => {
            console.log('Attempting reconnect...');
            this.reconnect();
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
                this.onClientListChange(this.clientList);
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
            case 'auth':
                this.onAuthChange(true);
            break;
            default: 
                console.log('Unhandled WS message type: ' + msg.type);
            break;
        }
    }

    get opened() {
        return this.socket.readyState === WebSocket.OPEN;
    }

    send(msg, opt={}) {
        const copy = Object.assign({}, msg);
        if(opt.auth) copy.token = this.token;
        this.socket.send(JSON.stringify(copy))
    }

    auth(token) {
        if(!this.opened) return;
        this.token = token;
        this.send({
            type: 'auth'
        }, {
            auth: true
        });
    }

    deauth() {
        if(!this.opened) return;
        this.send({
            type: 'deauth'
        }, { 
            auth: true 
        });
        this.clear();
    }
}

export default WebSocketClient;