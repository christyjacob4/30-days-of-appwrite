<script lang="ts">
	import { modalStore } from '$lib/stores/modal';

	function onRegister() {
		modalStore.open('register');
	}

	function onLogin() {
		modalStore.open('login');
	}
</script>

<header class="bg-generic-0">
	<div class="max-w-[870px] mx-auto py-8 flex justify-between items-center">
		<a href="/">
			<h1 class="uppercase text-primary-120 font-semibold tracking-widest">30 days of appwrite</h1>
		</a>
		<nav class="flex items-center justify-end space-x-8">
			<button on:click={onLogin} class="px-8 text-generic-100 font-semibold">Login</button>
			<button on:click={onRegister} class="px-8 text-generic-100 font-semibold">Register</button>
		</nav>
	</div>
</header>
