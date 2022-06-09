import { browser } from '$app/env';
import { writable } from 'svelte/store';

function createStore() {
	const typeStore = writable<
		| {
				msg: string;
				type: string;
		  }
		| undefined
	>(undefined);

	let interval: any = null;

	return {
		subscribe: typeStore.subscribe,
		close: () => {
			if (browser) {
				typeStore.set(undefined);

				if (interval) {
					clearTimeout(interval);
				}
			}
		},
		warning: (message: string) => {
			if (browser) {
				typeStore.set({
					msg: message,
					type: 'warning'
				});

				if (interval) {
					clearTimeout(interval);
				}
			}
		},
		success: (message: string) => {
			if (browser) {
				typeStore.set({
					msg: message,
					type: 'success'
				});

				if (interval) {
					clearTimeout(interval);
				}

				interval = setTimeout(() => {
					interval = null;
					typeStore.set(undefined);
				}, 3000);
			}
		}
	};
}

export const alertStore = createStore();
