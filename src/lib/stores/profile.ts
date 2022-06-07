import type { Profile } from '$lib/appwrite';
import { writable } from 'svelte/store';

function createStore() {
	const typeStore = writable<Profile | undefined>(undefined);

	return {
		subscribe: typeStore.subscribe,
		logout: () => typeStore.set(undefined),
		login: (profile: Profile) => typeStore.set(profile)
	};
}

export const profileStore = createStore();
