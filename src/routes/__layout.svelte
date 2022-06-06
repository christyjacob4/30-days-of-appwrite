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
	import ForgotPassword from '$lib/comps/ForgotPassword.svelte';
	import ForgotPasswordFinish from '$lib/comps/ForgotPasswordFinish.svelte';

	function isWithoutFooter(page: string) {
		const pagesWithoutFooter = [
			'/login',
			'/register',
			'/user/create-profile',
			'/writer/create-post'
		];
		if (pagesWithoutFooter.includes(page)) {
			return true;
		}

		if (page.endsWith('/edit')) {
			// writer/posts/[id]/edit
			return true;
		}
	}
</script>

<svelte:head>
	<title>{__APP_NAME__}</title>
</svelte:head>

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
	class={`py-8 ${isWithoutFooter($page.url.pathname) ? '!border-b-0' : ''}`}
>
	<div class="max-w-[870px] mx-auto">
		<slot />
	</div>
</div>

{#if !isWithoutFooter($page.url.pathname)}
	<Footer />
{/if}

<!-- MODALS -->
<div class="z-40">
	<Modal title="Register" type="register"><Register /></Modal>
	<Modal title="Login" type="login"><Login /></Modal>
	<Modal title="Forgot Password" type="forgot-password"><ForgotPassword /></Modal>
	<Modal title="Reset Password" type="forgot-password-finish"><ForgotPasswordFinish /></Modal>
</div>
<!-- MODALS END -->
