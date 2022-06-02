import { writable } from "svelte/store";

function createStore() {
    const typeStore = writable<{
        type: string,
        data: any | undefined
    } | undefined>(undefined);

    return {
        subscribe: typeStore.subscribe,
        close: () => typeStore.set(undefined),
        open: (type: string, data: any | undefined) => typeStore.set({ type, data })
    };
}

export const modalStore = createStore();