import { LightningElement, wire } from 'lwc';
import { subscribe, unsubscribe, MessageContext, APPLICATION_SCOPE } from 'lightning/messageService';
import RECORD_SELECTED from '@salesforce/messageChannel/Record_Selected__c';

/**
 * LMS SUBSCRIBER — APPLICATION_SCOPE hears messages across the whole app
 * (including from utility bar / other tabs' components), not just the
 * active region. Always unsubscribe in disconnectedCallback.
 */
export default class LmsSelectionDetail extends LightningElement {
    recordId;
    recordName;
    subscription = null;

    @wire(MessageContext) messageContext;

    connectedCallback() {
        this.subscription = subscribe(
            this.messageContext,
            RECORD_SELECTED,
            (message) => {
                this.recordId = message.recordId;
                this.recordName = message.recordName;
            },
            { scope: APPLICATION_SCOPE }
        );
    }

    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }
}
