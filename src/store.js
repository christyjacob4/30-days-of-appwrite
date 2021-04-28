import { writable } from "svelte/store";

export const state = writable({
    user: null,
    theme: null,
    profile: null,
});
