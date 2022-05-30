<script lang="ts">
	export let type: string = 'button';
	export let color: 'primary' | 'secondary' = 'primary';
	export let icon: 'google' | undefined = undefined;
	export let title: string;

	$: classes =
		color === 'primary'
			? 'bg-primary-110 text-neutral-0 border border-primary-100'
			: 'bg-neutral-0 border border-neutral-10';
</script>

<button
	{type}
	class={`py-4 px-3 w-full rounded-md flex space-x-1 items-center justify-center font-semibold text-base ${classes}`}
>
	{#if icon}
		<img src={`/${icon}.svg`} alt={`${icon} icon`} />
	{/if}
	<span>{title}</span>
</button>
