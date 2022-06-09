<script>
	import { goto } from '$app/navigation';

	import { authStore } from '$lib/stores/auth';
	import { profileStore } from '$lib/stores/profile';
	import { onMount } from 'svelte';

	$: isAllowed = $authStore && !$profileStore;

	onMount(() => {
		if (!isAllowed) {
			goto('/auth/login');
		}
	});
</script>

<div class="max-w-[870px] mx-auto">
	{#if isAllowed}
		<slot />
	{/if}
</div>
