<script lang="ts">
	import Loading from './Loading.svelte';

	export let type: string = 'button';
	export let color: 'primary' | 'secondary' | 'tertiary' = 'primary';
	export let icon: 'google' | undefined = undefined;
	export let title: string;
	export let name: string | undefined = undefined;
	export let loading: boolean = false;
	export let full: boolean = true;

	$: classes =
		color === 'primary'
			? 'bg-primary-110 text-neutral-0 border border-primary-110 hover:bg-primary-100 hover:border-primary-100'
			: color === 'secondary'
			? 'bg-neutral-0 border border-neutral-10 hover:bg-generic-0'
			: 'bg-generic-0 border border-generic-0 hover:bg-generic-0 hover:text-neutral-120 text-neutral-100';
</script>

<button
	on:click
	{type}
	{name}
	class={`py-4 px-6 rounded-md flex space-x-1 items-center justify-center font-semibold text-base ${classes} ${
		full ? 'w-full' : ''
	}`}
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
