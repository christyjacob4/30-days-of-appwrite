import { writable } from "svelte/store";

function createStore() {
    const typeStore = writable<{
        msg: string;
        type: string;
    } | undefined>(undefined);

    return {
        subscribe: typeStore.subscribe,
        close: () => typeStore.set(undefined),
        warning: (message: string) => {
            typeStore.set({
                msg: message,
                type: "warning"
            });
        },
        success: (message: string) => {
            typeStore.set({
                msg: message,
                type: "success"
            });
        }
    };
}

export const alertStore = createStore();