import { createElement } from 'lwc';
import SearchBox from 'c/searchBox';

describe('c-search-box', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.useRealTimers();
    });

    it('debounces the search event by 300ms', () => {
        const element = createElement('c-search-box', { is: SearchBox });
        document.body.appendChild(element);

        const handler = jest.fn();
        element.addEventListener('search', handler);

        const input = element.shadowRoot.querySelector('lightning-input');
        input.value = 'salesforce';
        input.dispatchEvent(new CustomEvent('change', { target: input }));

        jest.advanceTimersByTime(299);
        expect(handler).not.toHaveBeenCalled(); // not yet — still inside debounce window

        jest.advanceTimersByTime(1);
        expect(handler).toHaveBeenCalledTimes(1); // fires exactly at 300ms
    });
});
