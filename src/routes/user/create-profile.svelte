<script lang="ts">
	import { goto } from '$app/navigation';

	import { AppwriteService } from '$lib/appwrite';

	import Button from '$lib/core/Button.svelte';

	import { InputValidators } from '$lib/core/Input';

	import Input from '$lib/core/Input.svelte';
	import { alertStore } from '$lib/stores/alert';
	import { authStore } from '$lib/stores/auth';

	let nickname = '';

	let loading = false;

	async function onCreate() {
		if (!$authStore) {
			return;
		}

		loading = true;

		try {
			await AppwriteService.createProfile($authStore.$id, nickname);
			await AppwriteService.getSelfProfile();
			alertStore.close();
			goto('/writer/profile');
		} catch (err: any) {
			alertStore.warning(err.message);
		} finally {
			loading = false;
		}
	}
</script>

<div class="w-full max-w-[442px] mx-auto">
	<h1 class="text-center mb-10 font-poppins text-3xl font-semibold text-generic-100 ">
		Welcome {$authStore?.name}!
	</h1>

	<div class="shadow-small bg-generic-0 rounded-2xl p-6">
		<h2 class="font-poppins font-medium text-2xl text-neutral-200 mb-2">Create your profile</h2>
		<p class="text-neutral-100 font-normal text-base">Time to create your profile.</p>

		<form on:submit|preventDefault={onCreate} class="mt-6 flex flex-col space-y-6">
			<Input
				bind:value={nickname}
				validator={InputValidators.nickname}
				id="nickname"
				placeholder="Enter a username"
				type="text"
				title="Username"
				required={true}
			/>

			<Button {loading} type="submit" title="Create profile" color="primary" />
		</form>
	</div>
</div>
