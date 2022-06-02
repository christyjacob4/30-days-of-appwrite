<script lang="ts">
	import { modalStore } from '$lib/stores/modal';
	import { fade } from 'svelte/transition';

	export let title: string;
	export let type: string;
</script>

{#if $modalStore?.type === type}
	<div
		transition:fade
		class="fixed inset-0 bg-[#C4C4C4] bg-opacity-50 flex flex-col space-y-10 items-center justify-center"
		on:click={modalStore.close}
	>
		<section
			class="w-full max-w-[442px] mx-auto bg-generic-0 shadow-large rounded-2xl p-8"
			on:click|stopPropagation
		>
			<header class="flex items-center justify-between">
				<h1 class="text-neutral-200 font-medium text-2xl font-poppins">{title}</h1>
				<button on:click={modalStore.close}
					><img src="/icons/close.svg" alt="Close Modal" class="w-6" /></button
				>
			</header>

			<main class="mt-6">
				<slot />
			</main>
		</section>
	</div>
{/if}
