<script lang="ts">
	import { AppwriteService } from '$lib/appwrite';
	import Button from '$lib/core/Button.svelte';
	import { InputValidators } from '$lib/core/Input';
	import Input from '$lib/core/Input.svelte';
	import { alertStore } from '$lib/stores/alert';
	import { modalStore } from '$lib/stores/modal';

	let email: string;

	let loading = false;

	async function onResetPassword() {
		loading = true;

		try {
			await AppwriteService.resetPassword(email);
			modalStore.close();
			alertStore.success("We've sent you a link to reset your password. Check your email!");
		} catch (err: any) {
			alertStore.warning(err.message);
		} finally {
			loading = false;
		}
	}
</script>

<form on:submit|preventDefault={onResetPassword} class="flex flex-col space-y-4">
	<Input
		bind:value={email}
		validator={InputValidators.email}
		id="email"
		placeholder="Enter your email"
		type="text"
		title="Email"
		required={true}
	/>
	<div class="pt-4">
		<Button {loading} type="submit" title="Reset Password" color="primary" />
	</div>
</form>
