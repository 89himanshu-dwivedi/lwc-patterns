import { LightningElement, api } from 'lwc';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';

/**
 * LWC INSIDE A SCREEN FLOW (lightning__FlowScreen target).
 * @api rating is a flow input/output variable; FlowAttributeChangeEvent
 * pushes each change back into the flow so downstream Decision elements
 * can branch on it. Custom UI where standard flow components fall short.
 */
export default class FlowRatingInput extends LightningElement {
    @api rating = 5;

    handleChange(event) {
        this.rating = event.detail.value;
        this.dispatchEvent(new FlowAttributeChangeEvent('rating', this.rating));
    }
}
