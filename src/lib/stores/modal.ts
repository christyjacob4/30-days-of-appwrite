import { writable } from "svelte/store";

function createStore() {
    const typeStore = writable<string | undefined>(undefined);

    return {
        subscribe: typeStore.subscribe,
        close: () => typeStore.set(undefined),
        open: (type: string) => typeStore.set(type)
    };
}

export const modalStore = createStore();