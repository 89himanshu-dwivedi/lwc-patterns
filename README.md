# LWC Patterns — Communication, Composition, Interop & Testing

![LWC](https://img.shields.io/badge/LWC-Lightning-1589EE) ![Aura](https://img.shields.io/badge/Aura-interop-orange) ![Flow](https://img.shields.io/badge/Flow-embedded-00A1E0) ![Jest](https://img.shields.io/badge/Jest-tested-99424F)

Every LWC pattern an interviewer asks about — as deployable metadata, with Jest tests for the component contract.

## Pattern map

| Pattern | Components | The one-liner |
|---------|-----------|---------------|
| **`@wire` + `refreshApex`** | `contactList` ← `AccountContactController` | Store the whole provisioned result; loading/error/data as mutually exclusive `lwc:if` branches |
| **Parent → Child → Parent (events)** | `parentTaskBoard` + `childTaskCard` | Data down via `@api`, events up via `CustomEvent`; immutable state updates |
| **Unrelated components (LMS)** | `lmsAccountPicker` → `lmsSelectionDetail` via `Record_Selected`; `orderPublisher` → `orderSubscriber` via `OrderSelected` | `publish`/`subscribe`, `APPLICATION_SCOPE`, unsubscribe hygiene |
| **Slots + `@api` methods** | `baseModal` | Named slots with fallback content; ownership beats position |
| **Debounce + custom events** | `searchBox` | 300ms debounce, event detail as the component contract |
| **LWC inside a Screen Flow** | `flowRatingInput` | `lightning__FlowScreen` target + `FlowAttributeChangeEvent` back into flow variables |
| **Real-time (Platform Events)** | `orderEventFeed` + `Order_Status_Event__e` + `OrderEventPublisher` | `lightning/empApi` subscribe/unsubscribe, replayId, bounded feed |
| **Aura ↔ LWC interop** | `aura/lwcHostShell` hosting `parentTaskBoard` | Aura can host LWC, never the reverse → migrate **leaf-first** |

## Communication decision tree

```
Same DOM tree?
├── parent→child .......... @api property
├── child→parent .......... CustomEvent
└── No relationship?
    ├── same page/app ..... Lightning Message Service (works with Aura & VF too)
    ├── server push ....... Platform Event + empApi
    └── inside a flow ..... FlowAttributeChangeEvent
```

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

## Deploy

```bash
sf project deploy start -o myorg
```

## Structure

```
force-app/main/default/
├── lwc/                 # 11 components + __tests__
├── aura/                # lwcHostShell (interop demo)
├── classes/             # AccountContactController, OrderEventPublisher
├── messageChannels/     # OrderSelected, Record_Selected
└── objects/             # Order_Status_Event__e (platform event)
```
