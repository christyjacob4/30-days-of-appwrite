<script lang="ts">
	import { goto } from '$app/navigation';

	import { AppwriteService } from '$lib/appwrite';
	import Loading from '$lib/core/Loading.svelte';
	import { alertStore } from '$lib/stores/alert';

	import { authStore } from '$lib/stores/auth';
	import { modalStore } from '$lib/stores/modal';

	function onRegister() {
		modalStore.open('register');
	}

	function onLogin() {
		modalStore.open('login');
	}

	async function onLogout() {
		try {
			await AppwriteService.logout();
			alertStore.close();
			goto('/login');
			alertStore.success('Successfully logged out.');
		} catch (err: any) {
			alertStore.warning(err.message);
		}
	}

	async function getAccount() {
		try {
			await AppwriteService.getAccount();
		} catch (err) {
			// Ignore
		}
	}
</script>

<header class="bg-generic-0">
	<div class="max-w-[870px] mx-auto py-8 flex justify-between items-center">
		<a href="/">
			<h1 class="uppercase text-primary-120 font-semibold tracking-widest">{__APP_NAME__}</h1>
		</a>

		{#await getAccount()}
			<Loading />
		{:then}
			{#if $authStore}
				<nav class="flex items-center justify-end space-x-3">
					<a href="/writer/my-teams" class="px-3 text-generic-100 font-semibold">My Teams</a>
					<button on:click={onLogout} class="px-3 text-generic-100 font-semibold">Log Out</button>

					<a href="/writer/profile">
						<img
							class="w-8 rounded-full"
							src={AppwriteService.getAvatar($authStore.name).toString()}
							alt="Author profile"
						/></a
					>
				</nav>
			{:else}
				<nav class="flex items-center justify-end space-x-3">
					<button on:click={onLogin} class="px-3 text-generic-100 font-semibold">Login</button>
					<button on:click={onRegister} class="px-3 text-generic-100 font-semibold">Register</button
					>
				</nav>
			{/if}
		{/await}
	</div>
</header>
