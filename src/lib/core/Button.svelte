<script lang="ts">
	import Loading from './Loading.svelte';

	export let type: string = 'button';
	export let color: 'primary' | 'secondary' = 'primary';
	export let icon: 'google' | undefined = undefined;
	export let title: string;
	export let loading: boolean = false;

	$: classes =
		color === 'primary'
			? 'bg-primary-110 text-neutral-0 border border-primary-110 hover:bg-primary-100 hover:border-primary-100'
			: 'bg-neutral-0 border border-neutral-10 hover:bg-generic-0';
</script>

<button
	on:click
	{type}
	class={`py-4 px-6 w-full rounded-md flex space-x-1 items-center justify-center font-semibold text-base ${classes}`}
>
	{#if !loading}
		{#if icon}
			<img src={`/${icon}.svg`} alt={`${icon} icon`} />
		{/if}
		<span>{title}</span>
	{:else}
		<Loading />
	{/if}
</button>
