import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import RECORD_SELECTED from '@salesforce/messageChannel/Record_Selected__c';
import getAccountsAndContacts from '@salesforce/apex/AccountContactController.getAccountsAndContacts';

/**
 * LMS PUBLISHER — talks to components anywhere on the page (even Aura or VF),
 * no parent-child relationship needed. This is the answer to
 * "how do two unrelated components communicate?"
 */
export default class LmsAccountPicker extends LightningElement {
    accounts = [];

    @wire(MessageContext) messageContext;

    @wire(getAccountsAndContacts)
    wiredAccounts({ data }) {
        if (data) {
            this.accounts = data.map((a) => ({ id: a.id, name: a.Name }));
        }
    }

    handleSelect(event) {
        event.preventDefault();
        publish(this.messageContext, RECORD_SELECTED, {
            recordId: event.target.dataset.id,
            recordName: event.target.dataset.name
        });
    }
}
