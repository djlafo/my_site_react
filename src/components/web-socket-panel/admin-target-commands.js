import React, { Component } from 'react';

class AdminTargetCommands extends Component {

    constructor(props) {
        super(props);
        this.redirectClient = this.redirectClient.bind(this);
        this.applyClass = this.applyClass.bind(this);
        this.alertClient = this.alertClient.bind(this);
    }

    redirectClient(e) {
        let target = prompt('Enter URL');
        if(!target) return;
        let client = e.target.dataset.id;
        this.props.onCommand({
            type: 'redirect',
            client: client,
            target: target,
            token: this.props.user.token
        });
    }

    applyClass(e) {
        this.props.onCommand({
            type: 'apply_class',
            class: e.target.dataset.class,
            client: e.target.dataset.id,
            token: this.props.user.token,
            apply: e.target.value === e.target.dataset.regText
        });
        e.target.value = e.target.value === e.target.dataset.regText ? e.target.dataset.altText : e.target.dataset.regText;
    }

    alertClient(e) {
        let msg = prompt('Enter message');
        this.props.onCommand({
            type: 'alert',
            client: e.target.dataset.id,
            msg: msg,
            token: this.props.user.token
        });
    }

    render() {
        return <div className='admin-target-commands'>
            <input type="button"
                value="Redirect"
                data-id={this.props.client.id}
                onClick={this.redirectClient} />
            <input type="button"
                value="Flip Vertical"
                data-reg-text="Flip Vertical"
                data-alt-text="Unflip Vertical"
                data-class="flip-vertical"
                data-id={this.props.client.id}
                onClick={this.applyClass} />
            <input type="button"
                value="Tinify"
                data-reg-text="Tinify"
                data-alt-text="Un-Tinify"
                data-class="tiny"
                data-id={this.props.client.id}
                onClick={this.applyClass} />
            <input type="button"
                value="Alert"
                data-id={this.props.client.id}
                onClick={this.alertClient} />
        </div>;
    }
}

export default AdminTargetCommands;