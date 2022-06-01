<script context="module" lang="ts">
	import { AppwriteService } from '$lib/appwrite';

	export async function load() {
		try {
			await AppwriteService.getAccount();
		} catch (_err) {}

		try {
			await AppwriteService.getSelfProfile();
		} catch (_err) {}

		return {};
	}
</script>

<script lang="ts">
	import '../app.css';

	import Header from '$lib/comps/Header.svelte';
	import Footer from '$lib/comps/Footer.svelte';
	import Register from '$lib/comps/Register.svelte';
	import Login from '$lib/comps/Login.svelte';
	import { alertStore } from '$lib/stores/alert';
	import Alert from '$lib/core/Alert.svelte';
	import { page } from '$app/stores';
	import Modal from '$lib/core/Modal.svelte';
	import { fade } from 'svelte/transition';

	// Layout changes
	const pagesWithoutFooter = ['/login', '/register', '/user/create-profile', '/writer/create-post'];
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
		<slot />
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
