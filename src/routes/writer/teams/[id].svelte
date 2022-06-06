<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { AppwriteService } from '$lib/appwrite';

	import TeamDelete from '$lib/comps/TeamDelete.svelte';
	import Button from '$lib/core/Button.svelte';
	import { InputValidators } from '$lib/core/Input';
	import Input from '$lib/core/Input.svelte';
	import Loading from '$lib/core/Loading.svelte';
	import Modal from '$lib/core/Modal.svelte';
	import { alertStore } from '$lib/stores/alert';
	import { modalStore } from '$lib/stores/modal';
	import type { Models } from 'appwrite';
	import { onMount } from 'svelte';

	let team: Models.Team | undefined;

	onMount(async () => {
		try {
			team = await AppwriteService.getTeamById($page.params.id);
		} catch (err: any) {
			alertStore.warning(err.message);
		}
	});

	async function onTeamDelete() {
		await goto('/writer/teams');
	}

	let memberName = '';
	let memberEmail = '';
	let memberRole = 'member';
	let processingMemberCreate = false;

	async function onAddMember() {
		if (processingMemberCreate || !team) {
			return;
		}

		processingMemberCreate = true;

		try {
			await AppwriteService.inviteTeamMember(team.$id, memberEmail, [memberRole], memberName);
			alertStore.success('Team invitation created successfully.');
			modalStore.close();
		} catch (err: any) {
			alertStore.warning(err.message ? err.message : err);
		} finally {
			processingMemberCreate = false;
		}
	}
</script>

<div class="w-full max-w-[770px] mx-auto flex flex-col space-y-10">
	{#if team}
		<div class="flex items-center justify-between">
			<div class="flex items-center justify-start space-x-2 w-full">
				<h1 class="line-clamp-1 text-center font-poppins text-3xl font-semibold text-generic-100">
					{team.name}
				</h1>
			</div>

			<div class="flex space-x-4 items-center justify-end flex-shrink-0">
				<Button
					on:click={() => modalStore.open('delete-team')}
					full={false}
					type="button"
					title="Delete Team"
					color="tertiary"
				/>
				<Button
					on:click={() => modalStore.open('add-team-member')}
					full={false}
					type="button"
					title="Add Member"
					color="primary"
				/>
			</div>
		</div>

		<div class="flex flex-col space-y-8">
			<h3 class="uppercase text-generic-100 tracking-widest font-semibold">Members</h3>
		</div>

		<!-- TODO: Member list, deleting members -->
	{:else}
		<Loading />
	{/if}
</div>

<TeamDelete on:delete={onTeamDelete} />

<Modal title="Add new member" type="add-team-member">
	<form on:submit|preventDefault={onAddMember} class="flex flex-col space-y-4">
		<Input
			bind:value={memberName}
			validator={InputValidators.name}
			required={true}
			id="name"
			placeholder="Enter name"
			type="text"
			title="Name"
		/>
		<Input
			bind:value={memberEmail}
			validator={InputValidators.email}
			required={true}
			id="email"
			placeholder="Enter email"
			type="text"
			title="Email"
		/>

		<fieldset class="flex flex-col space-y-1">
			<label class="text-neutral-150 text-base font-normal" for="role">Enter role</label>

			<select
				class={`hover:border-neutral-30 rounded-md bg-generic-0 border border-neutral-5 px-4 py-3 text-neutral-120 placeholder-neutral-100 font-normal text-base outline-secondary-100 focus:ring-secondary-100 focus:ring focus:ring-opacity-25 ring-opacity-25`}
				id="role"
				bind:value={memberRole}
				required={true}
			>
				<option value="member" selected={true}>Member</option>
				<option value="owner">Owner</option>
			</select>
		</fieldset>

		<div class="pt-4">
			<Button loading={processingMemberCreate} type="submit" title="Add Member" color="primary" />
		</div>
	</form>
</Modal>
