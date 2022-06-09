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
	let name: string;

	let loading = false;

	async function onRegister() {
		loading = true;

		try {
			await AppwriteService.register(email, password, name);
			modalStore.close();
			alertStore.close();
			goto('/user/create-profile');
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

<form on:submit|preventDefault={onRegister} class="flex flex-col space-y-4">
	<Input
		bind:value={name}
		validator={InputValidators.name}
		required={true}
		id="name"
		placeholder="Enter your name"
		type="text"
		title="Name"
	/>
	<Input
		bind:value={email}
		validator={InputValidators.email}
		required={true}
		id="email"
		placeholder="Enter your email"
		type="text"
		title="Email"
	/>
	<Input
		bind:value={password}
		validator={InputValidators.password}
		required={true}
		id="password"
		placeholder="Enter your password"
		type="password"
		title="Password"
	/>

	<div class="pt-4">
		<Button {loading} type="submit" title="Register" color="primary" />
	</div>
	<Button
		on:click={onLoginGoogle}
		type="button"
		title="Register with Google"
		color="secondary"
		icon="google"
	/>
</form>
