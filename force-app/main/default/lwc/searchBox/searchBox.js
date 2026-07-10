import { LightningElement } from 'lwc';

const DEBOUNCE_MS = 300;

/**
 * Debounced search input.
 * The event detail is the component's contract — parent listens to `search`.
 */
export default class SearchBox extends LightningElement {
    debounceTimer;

    handleInput(event) {
        const term = event.target.value;
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.dispatchEvent(new CustomEvent('search', {
                detail: { term }
            }));
        }, DEBOUNCE_MS);
    }

    disconnectedCallback() {
        clearTimeout(this.debounceTimer);
    }
}
