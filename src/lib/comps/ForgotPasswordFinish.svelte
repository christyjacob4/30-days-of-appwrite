<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { AppwriteService } from '$lib/appwrite';
	import Button from '$lib/core/Button.svelte';
	import { InputValidators } from '$lib/core/Input';
	import Input from '$lib/core/Input.svelte';
	import { alertStore } from '$lib/stores/alert';
	import { modalStore } from '$lib/stores/modal';

	let password: string;
	let passwordAgain: string;

	let loading = false;

	async function onFinishReset() {
		loading = true;

		let userId = $page.url.searchParams.get('userId');
		let secret = $page.url.searchParams.get('secret');

		try {
			if (!userId || !secret) {
				throw new Error('URL no longer valid.');
			}

			await AppwriteService.resetPasswordFinish(userId, secret, password, passwordAgain);
			modalStore.open('login');
			alertStore.success('Password updateed successfully! You can login now.');

			window.history.pushState({}, document.title, window.location.pathname);
		} catch (err: any) {
			alertStore.warning(err.message);
		} finally {
			loading = false;
		}
	}
</script>

<form on:submit|preventDefault={onFinishReset} class="flex flex-col space-y-4">
	<Input
		bind:value={password}
		validator={InputValidators.password}
		id="password"
		placeholder="Enter your password"
		type="password"
		title="Password"
		required={true}
	/>
	<Input
		bind:value={passwordAgain}
		validator={InputValidators.password}
		id="password"
		placeholder="Enter your password"
		type="password"
		title="Confirm Password"
		required={true}
	/>
	<div class="pt-4">
		<Button {loading} type="submit" title="Reset Password" color="primary" />
	</div>
</form>
