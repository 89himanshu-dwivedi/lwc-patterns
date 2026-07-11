import { LightningElement } from 'lwc';
import { subscribe, unsubscribe, onError } from 'lightning/empApi';

/**
 * Real-time LWC: subscribes to Order_Status_Event__e platform events.
 * Shows the full lifecycle — subscribe on connect, unsubscribe on disconnect
 * (no leaked CometD subscriptions), replayId -1 = new events only.
 */
export default class OrderEventFeed extends LightningElement {
    channel = '/event/Order_Status_Event__e';
    subscription = null;
    events = [];

    connectedCallback() {
        onError((error) => console.error('EMP error: ', JSON.stringify(error)));
        subscribe(this.channel, -1, (message) => this.handleEvent(message))
            .then((sub) => { this.subscription = sub; });
    }

    disconnectedCallback() {
        if (this.subscription) {
            unsubscribe(this.subscription, () => { this.subscription = null; });
        }
    }

    handleEvent(message) {
        const payload = message.data.payload;
        this.events = [
            {
                key: message.data.event.replayId,
                orderNumber: payload.Order_Number__c,
                status: payload.Status__c,
                receivedAt: new Date().toLocaleTimeString()
            },
            ...this.events
        ].slice(0, 20); // keep the feed bounded
    }
}
