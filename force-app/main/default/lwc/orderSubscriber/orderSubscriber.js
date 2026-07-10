import { LightningElement, wire } from 'lwc';
import {
    subscribe,
    unsubscribe,
    MessageContext,
    APPLICATION_SCOPE
} from 'lightning/messageService';
import ORDER_SELECTED from '@salesforce/messageChannel/OrderSelected__c';

/**
 * LMS subscriber.
 * Scope is the SUBSCRIBER's decision:
 * - default (no scope): only the active area — console workspace tabs stay isolated
 * - APPLICATION_SCOPE: every subscriber in the app, including background tabs
 */
export default class OrderSubscriber extends LightningElement {
    @wire(MessageContext) messageContext;

    subscription = null;
    selectedOrderId;

    connectedCallback() {
        this.subscription = subscribe(
            this.messageContext,
            ORDER_SELECTED,
            (message) => this.handleMessage(message),
            { scope: APPLICATION_SCOPE }
        );
    }

    disconnectedCallback() {
        unsubscribe(this.subscription); // always clean up — avoid leaks
        this.subscription = null;
    }

    handleMessage(message) {
        this.selectedOrderId = message.orderId;
    }
}
