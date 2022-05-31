import type { Models } from "appwrite";
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
            // console.log(message);
            typeStore.set({
                msg: message,
                type: "warning"
            });
        },
        success: (message: string) => {
            // console.log(message);
            typeStore.set({
                msg: message,
                type: "success"
            });
        }
    };
}

export const alertStore = createStore();