import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import ORDER_SELECTED from '@salesforce/messageChannel/OrderSelected__c';

/**
 * LMS publisher — fires a message any subscriber on the page can receive,
 * regardless of DOM hierarchy (siblings, other regions, Aura, even VF).
 */
export default class OrderPublisher extends LightningElement {
    @wire(MessageContext) messageContext;

    handleSelect(event) {
        publish(this.messageContext, ORDER_SELECTED, {
            orderId: event.target.dataset.id,
            source: 'orderPublisher'
        });
    }
}
