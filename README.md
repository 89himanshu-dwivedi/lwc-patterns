# LWC Patterns

Modern Lightning Web Component patterns — reactive data with `@wire` + `refreshApex`, cross-component messaging with LMS, slot-based composition, and Jest unit tests for the component's public contract.

## Components

| Component | Pattern | Key idea |
|---|---|---|
| `contactList` | `@wire` + `refreshApex` + `lwc:if` chain | Store the whole provisioned result; loading/error/data as mutually exclusive branches |
| `orderPublisher` / `orderSubscriber` | Lightning Message Service | DOM-hierarchy-independent pub/sub; subscriber owns the scope decision |
| `baseModal` | Slots + `@api` methods | Named slots with fallback content; ownership beats position |
| `searchBox` | Debounce + custom events | 300ms debounce, event detail as the component contract |

## Jest testing

Tests cover the **public contract** — props in → DOM out, dispatched events, wire data **and** error branches:

```bash
npm install
npm run test           # single run
npm run test:watch     # dev mode
```

Key techniques demonstrated in `__tests__`:
- `createElement` + `element.shadowRoot.querySelector`
- `await flushPromises()` for async re-renders
- Wire adapter `.emit()` / `.error()` control
- `jest.fn()` event handler assertions

## Structure

```
force-app/main/default/
├── lwc/                 # components + __tests__
└── messageChannels/     # LMS channel definition
```
