<script lang="ts">
	import '../app.css';

	import Header from '$lib/comps/Header.svelte';
	import Footer from '$lib/comps/Footer.svelte';
	import Register from '$lib/comps/Register.svelte';
	import Login from '$lib/comps/Login.svelte';
	import { alertStore } from '$lib/stores/alert';
	import Alert from '$lib/core/Alert.svelte';
	import { page } from '$app/stores';
	import { AppwriteService } from '$lib/appwrite';
	import Loading from '$lib/core/Loading.svelte';
	import { goto } from '$app/navigation';
	import Modal from '$lib/core/Modal.svelte';
	import { fade } from 'svelte/transition';
	import type { Models } from 'appwrite';

	// Guards (middlewares)
	const pagesWithSession = ['/create-profile'];
	const pagesWithProfile = ['/profile', '/my-teams'];
	const pagesWithoutSession = ['/login', '/register'];

	// Layout changes
	const pagesWithoutFooter = ['/login', '/register', '/create-profile'];

	const profilePromise = async () => {
		try {
			await AppwriteService.getAccount();
		} catch (err: any) {
			alertStore.warning(err.message);
			goto('/');
			return;
		}

		try {
			await AppwriteService.getProfile();
		} catch (err: any) {
			alertStore.warning(err.message);
			goto('/create-profile');
			return;
		}
	};

	const sessionPromise = async () => {
		try {
			await AppwriteService.getAccount();
		} catch (err: any) {
			alertStore.warning(err.message);
			goto('/');
			return;
		}

		try {
			const profile = await AppwriteService.getProfile();
			if (profile) {
				throw new Error('You already have a profile.');
			}
		} catch (err: any) {
			alertStore.warning(err.message);
			goto('/profile');
			return;
		}
	};

	const noSessionPromise = async () => {
		try {
			const account = await AppwriteService.getAccount();
			if (account) {
				throw new Error('You are already logged in.');
			}
		} catch (err: any) {
			alertStore.warning(err.message);
			goto('/');
			return;
		}
	};
</script>

<div class="fixed top-8 left-0 w-full pointer-events-none z-50">
	{#if $alertStore}
		<div transition:fade class="w-full max-w-[770px] mx-auto">
			<div class="w-full pointer-events-auto">
				<Alert message={$alertStore.msg} type={$alertStore.type} />
			</div>
		</div>
	{/if}
</div>

<Header />

<div
	style="border: 1px solid rgba(232, 233, 240, 0.49);"
	class={`py-8 ${pagesWithoutFooter.includes($page.url.pathname) ? '!border-b-0' : ''}`}
>
	<div class="max-w-[870px] mx-auto">
		{#if pagesWithProfile.includes($page.url.pathname)}
			{#await profilePromise()}
				<Loading />
			{:then}
				<slot />
			{/await}
		{:else if pagesWithSession.includes($page.url.pathname)}
			{#await sessionPromise()}
				<Loading />
			{:then}
				<slot />
			{/await}
		{:else if pagesWithoutSession.includes($page.url.pathname)}
			{#await noSessionPromise()}
				<Loading />
			{:then}
				<slot />
			{/await}
		{:else}
			<slot />
		{/if}
	</div>
</div>

{#if !pagesWithoutFooter.includes($page.url.pathname)}
	<Footer />
{/if}

<!-- MODALS -->
<div class="z-40">
	<Modal title="Register" type="register"><Register /></Modal>
	<Modal title="Login" type="login"><Login /></Modal>
</div>
<!-- MODALS END -->
