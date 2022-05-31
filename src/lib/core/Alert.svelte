<script lang="ts">
	import { alertStore } from '$lib/stores/alert';

	export let message: string;
	export let type: string;

	$: classes =
		type === 'success' ? 'text-success-120 bg-success-10' : 'text-danger-120 bg-danger-10';
</script>

<div
	class={`w-full shadow-small w-fullrounded-md px-8 py-5 flex items-center justify-start ${classes}`}
>
	<div class="w-full flex items-center justify-start space-x-2">
		{#if type === 'success'}
			<img class="flex-shrink-0" src="/icons/alert-success.svg" alt="Success icon" />
		{:else if type === 'warning'}
			<img class="flex-shrink-0" src="/icons/alert-warning.svg" alt="Warning icon" />
		{/if}
		<p class="font-normal text-base text-left w-full">{message}</p>

		<button class="flex-shrink-0" on:click={alertStore.close}>
			<svg
				width="20"
				height="20"
				viewBox="0 0 20 20"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M5 15L15 5M5 5L15 15"
					stroke="currentColor"
					stroke-width="1.67"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
	</div>
</div>
