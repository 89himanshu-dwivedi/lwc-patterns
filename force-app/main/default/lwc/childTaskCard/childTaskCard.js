import { LightningElement, api } from 'lwc';

/**
 * CHILD in the parent-child event pattern.
 * Data DOWN via @api, events UP via CustomEvent — never mutate @api input.
 */
export default class ChildTaskCard extends LightningElement {
    @api task;

    handleToggle(event) {
        // detail is the contract with the parent; bubbles:false (default) keeps
        // the event scoped — parent listens via ontoggle on the child tag.
        this.dispatchEvent(new CustomEvent('toggle', {
            detail: { taskId: this.task.id, done: event.target.checked }
        }));
    }
}
