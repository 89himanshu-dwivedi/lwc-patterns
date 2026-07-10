import { createElement } from 'lwc';
import ContactList from 'c/contactList';
import getContacts from '@salesforce/apex/ContactController.getContacts';

// Imperative Apex must be mocked manually (virtual: the module only exists on-platform)
import createContact from '@salesforce/apex/ContactController.createContact';
jest.mock(
    '@salesforce/apex/ContactController.createContact',
    () => ({ default: jest.fn() }),
    { virtual: true }
);

const MOCK_CONTACTS = [
    { Id: '003000000000001', Name: 'Amit Sharma' },
    { Id: '003000000000002', Name: 'Priya Verma' }
];

async function flushPromises() {
    return Promise.resolve();
}

describe('c-contact-list', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    function createComponent() {
        const element = createElement('c-contact-list', { is: ContactList });
        element.recordId = '001000000000001';
        document.body.appendChild(element);
        return element;
    }

    it('shows spinner while loading', () => {
        const element = createComponent();
        const spinner = element.shadowRoot.querySelector('lightning-spinner');
        expect(spinner).not.toBeNull();
    });

    it('renders contacts when wire emits data', async () => {
        const element = createComponent();

        getContacts.emit(MOCK_CONTACTS);
        await flushPromises();

        const rows = element.shadowRoot.querySelectorAll('.contact-row');
        expect(rows.length).toBe(2);
        expect(rows[0].textContent).toBe('Amit Sharma');
    });

    it('renders error message when wire errors', async () => {
        const element = createComponent();

        getContacts.error({ body: { message: 'boom' } });
        await flushPromises();

        const errorEl = element.shadowRoot.querySelector('.slds-text-color_error');
        expect(errorEl).not.toBeNull();
    });

    it('calls createContact on button click', async () => {
        createContact.mockResolvedValue({ Id: '003000000000003' });
        const element = createComponent();

        getContacts.emit(MOCK_CONTACTS);
        await flushPromises();

        element.shadowRoot.querySelector('.add-btn').click();
        await flushPromises();

        expect(createContact).toHaveBeenCalledWith({ accountId: '001000000000001' });
    });
});
