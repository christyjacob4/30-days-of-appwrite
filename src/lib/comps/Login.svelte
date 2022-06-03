<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppwriteService } from '$lib/appwrite';
	import Button from '$lib/core/Button.svelte';
	import { InputValidators } from '$lib/core/Input';
	import Input from '$lib/core/Input.svelte';
	import { alertStore } from '$lib/stores/alert';
	import { modalStore } from '$lib/stores/modal';

	let email: string;
	let password: string;

	let loading = false;

	async function onLogin() {
		loading = true;

		try {
			await AppwriteService.login(email, password);
			modalStore.close();
			alertStore.close();
			goto('/writer/profile');
		} catch (err: any) {
			alertStore.warning(err.message);
		} finally {
			loading = false;
		}
	}

	async function onLoginGoogle() {
		try {
			await AppwriteService.loginWithGoogle();
		} catch (err: any) {
			alertStore.warning(err.message);
		}
	}
</script>

<form on:submit|preventDefault={onLogin} class="flex flex-col space-y-4">
	<Input
		bind:value={email}
		validator={InputValidators.email}
		id="email"
		placeholder="Enter your email"
		type="text"
		title="Email"
		required={true}
	/>
	<Input
		bind:value={password}
		validator={InputValidators.password}
		id="password"
		placeholder="Enter your password"
		type="password"
		title="Password"
		required={true}
	/>
	<Button {loading} type="submit" title="Login" color="primary" />
	<Button
		on:click={onLoginGoogle}
		type="button"
		title="Login with Google"
		color="secondary"
		icon="google"
	/>

	<!-- TODO: Implement -->
	<button type="button" class="underline text-neutral-150 font-normal text-base text-left"
		>Forgot password?</button
	>
</form>
