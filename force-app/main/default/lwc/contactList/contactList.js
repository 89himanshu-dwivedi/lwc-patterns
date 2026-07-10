import { LightningElement, api, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import createContact from '@salesforce/apex/ContactController.createContact';

/**
 * @wire + refreshApex pattern.
 * Key: store the WHOLE provisioned result — refreshApex needs the full
 * { data, error } envelope, not a destructured copy.
 */
export default class ContactList extends LightningElement {
    @api recordId;

    wiredContactsResult; // the full provisioned result — this is what refreshApex takes
    contacts;
    error;

    @wire(getContacts, { accountId: '$recordId' })
    wiredContacts(result) {
        this.wiredContactsResult = result;
        const { data, error } = result;
        this.contacts = data ?? undefined;
        this.error = error ?? undefined;
    }

    get isLoading() {
        return !this.contacts && !this.error;
    }

    async handleAddContact() {
        // await the DML first — refresh before commit re-reads stale data
        await createContact({ accountId: this.recordId });
        await refreshApex(this.wiredContactsResult);
    }
}
