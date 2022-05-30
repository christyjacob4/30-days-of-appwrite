<script lang="ts">
	import Button from '$lib/core/Button.svelte';
	import { InputValidators } from '$lib/core/Input';
	import Input from '$lib/core/Input.svelte';
	import Modal from '$lib/core/Modal.svelte';

	let email: string;
	let password: string;
	let name: string;

	function onRegister() {}
</script>

<Modal title="Register" type="register">
	<form on:submit|preventDefault={onRegister} class="flex flex-col space-y-4">
		<Input
			bind:value={name}
			validator={InputValidators.name}
			id="name"
			placeholder="Enter your name"
			type="text"
			title="Name"
		/>
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

		<Button type="submit" title="Register" color="primary" />
		<Button type="button" title="Register with Google" color="secondary" icon="google" />
	</form>
</Modal>
