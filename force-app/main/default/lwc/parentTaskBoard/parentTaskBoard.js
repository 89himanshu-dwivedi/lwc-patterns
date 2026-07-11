import { LightningElement } from 'lwc';

/**
 * PARENT in the parent-child event pattern.
 * Owns the state; children are dumb renderers. Immutable updates (map + spread)
 * so LWC reactivity picks up the change.
 */
export default class ParentTaskBoard extends LightningElement {
    tasks = [
        { id: '1', title: 'Design data model', done: true },
        { id: '2', title: 'Build LWC components', done: false },
        { id: '3', title: 'Write Jest tests', done: false }
    ];

    handleToggle(event) {
        const { taskId, done } = event.detail;
        this.tasks = this.tasks.map(
            (t) => (t.id === taskId ? { ...t, done } : t)
        );
    }

    get doneCount() {
        return this.tasks.filter((t) => t.done).length;
    }
}
