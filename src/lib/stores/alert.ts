import { browser } from "$app/env";
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
            if (browser) {
                typeStore.set({
                    msg: message,
                    type: "warning"
                });
            }
        },
        success: (message: string) => {
            if (browser) {
                typeStore.set({
                    msg: message,
                    type: "success"
                });
            }
        }
    };
}

export const alertStore = createStore();