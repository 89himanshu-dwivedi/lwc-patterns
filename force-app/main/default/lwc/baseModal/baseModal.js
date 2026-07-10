import { LightningElement, api } from 'lwc';

/**
 * Generic modal via slot composition.
 * The modal owns look & behavior; consumers own the content —
 * slotted markup stays bound to the PARENT (data, CSS, events).
 */
export default class BaseModal extends LightningElement {
    isOpen = false;

    @api open() {
        this.isOpen = true;
    }

    @api close() {
        this.isOpen = false;
        this.dispatchEvent(new CustomEvent('modalclose'));
    }

    handleBackdropClick() {
        this.close();
    }
}
