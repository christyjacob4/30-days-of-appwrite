import type { Models } from 'appwrite';
import { writable } from 'svelte/store';

function createStore() {
	const typeStore = writable<Models.User<any> | undefined>(undefined);

	return {
		subscribe: typeStore.subscribe,
		logout: () => typeStore.set(undefined),
		login: (user: Models.User<any>) => typeStore.set(user)
	};
}

export const authStore = createStore();
