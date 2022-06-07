<script lang="ts">
	export let id: string;
	export let title: string;
	export let type: string;
	export let required: boolean;
	export let placeholder: string;

	// Validators should be taken from InputValidators ($lib/core/Input.ts)
	export let validator: any = () => {};

	// Value of the input
	export let value: string = '';

	// Only show warning when input was touched at least once (user entered, and then leaved)
	let touched = false;

	// Only show success message if there was warning previously
	let hadProblem = false;

	// Error type and message to render UI properly
	let errorMessage: string | undefined;
	let errorType: 'success' | 'warning' | undefined;

	// Valid only if there is no error, or not yet touched
	// $: valid = !touched || errorType === 'success';

	// Error classes only if touched, and had problem. Success can also be a state that shows green success message.
	$: errorClasses =
		!touched || !hadProblem
			? ''
			: errorType === 'success'
			? 'outline-success-100 ring ring-success-100'
			: errorType === 'warning'
			? 'outline-warning-100 ring ring-warning-100'
			: '';

	function validate() {
		if (validator) {
			const response = validator(value);
			if (response && response.msg && response.type) {
				errorMessage = response.msg;
				errorType = response.type;

				if (touched && errorType === 'warning') {
					hadProblem = true;
				}

				return;
			}
		}

		errorMessage = 'All good!';
		errorType = 'success';
	}

	// When you leave input after tying (after filling it)
	function onChange() {
		touched = true;
		validate();
	}

	// When you type into input (each letter)
	function onInput($event: any) {
		value = $event.target.value;
		validate();
	}
</script>

<fieldset class="flex flex-col space-y-1">
	<label class="text-neutral-150 text-base font-normal" for={id}>{title}</label>
	{#if type === 'password'}
		<input
			on:change={onChange}
			on:input={onInput}
			bind:value
			class={`hover:border-neutral-30 rounded-md bg-generic-0 border border-neutral-5 px-4 py-3 text-neutral-120 placeholder-neutral-100 font-normal text-base outline-secondary-100 focus:ring-secondary-100 focus:ring focus:ring-opacity-25 ring-opacity-25 ${errorClasses}`}
			{id}
			{required}
			type="password"
			{placeholder}
		/>
	{:else if type === 'email'}
		<input
			on:change={onChange}
			on:input={onInput}
			bind:value
			class={`hover:border-neutral-30 rounded-md bg-generic-0 border border-neutral-5 px-4 py-3 text-neutral-120 placeholder-neutral-100 font-normal text-base outline-secondary-100 focus:ring-secondary-100 focus:ring focus:ring-opacity-25 ring-opacity-25 ${errorClasses}`}
			{id}
			{required}
			type="email"
			{placeholder}
		/>
	{:else}
		<input
			on:change={onChange}
			on:input={onInput}
			bind:value
			class={`hover:border-neutral-30 rounded-md bg-generic-0 border border-neutral-5 px-4 py-3 text-neutral-120 placeholder-neutral-100 font-normal text-base outline-secondary-100 focus:ring-secondary-100 focus:ring focus:ring-opacity-25 ring-opacity-25 ${errorClasses}`}
			{id}
			{required}
			type="text"
			{placeholder}
		/>
	{/if}

	{#if touched && hadProblem}
		<div class="pt-1 flex items-center justify-start space-x-1">
			<img src={`/icons/${errorType}.svg`} alt="Alert icon" />
			<p
				class={`font-normal text-sm ${
					errorType === 'success'
						? 'text-success-120'
						: errorType === 'warning'
						? 'text-warning-120'
						: ''
				}`}
			>
				{errorMessage}
			</p>
		</div>
	{/if}
</fieldset>
