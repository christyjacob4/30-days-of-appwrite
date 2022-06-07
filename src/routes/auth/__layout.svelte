<script>
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import { onMount } from 'svelte';

	$: isAllowed = !$authStore;

	onMount(() => {
		if (!isAllowed) {
			goto('/writer/profile');
		}
	});
</script>

<div class="max-w-[870px] mx-auto">
	{#if isAllowed}
		<slot />
	{/if}
</div>
