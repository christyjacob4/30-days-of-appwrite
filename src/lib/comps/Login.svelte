<script lang="ts">
	import Button from '$lib/core/Button.svelte';
	import { InputValidators } from '$lib/core/Input';
	import Input from '$lib/core/Input.svelte';
	import Modal from '$lib/core/Modal.svelte';

	let email: string;
	let password: string;

	function onLogin() {
		alert(email + ',' + password);
	}
</script>

<Modal title="Login" type="login">
	<form on:submit|preventDefault={onLogin} class="flex flex-col space-y-4">
		<Input
			bind:value={email}
			validator={InputValidators.email}
			id="email"
			placeholder="Enter your email"
			type="text"
			title="Email"
		/>
		<Input
			bind:value={password}
			validator={InputValidators.password}
			id="password"
			placeholder="Enter your password"
			type="password"
			title="Password"
		/>
		<Button type="submit" title="Login" color="primary" />
		<Button type="button" title="Login with Google" color="secondary" icon="google" />

		<button type="button" class="underline text-neutral-150 font-normal text-base text-left"
			>Forgot password?</button
		>
	</form>
</Modal>
