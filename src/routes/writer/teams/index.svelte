<script lang="ts">
	import { AppwriteService } from '$lib/appwrite';
	import TeamDelete from '$lib/comps/TeamDelete.svelte';
	import Button from '$lib/core/Button.svelte';
	import { InputValidators } from '$lib/core/Input';
	import Input from '$lib/core/Input.svelte';
	import Loading from '$lib/core/Loading.svelte';
	import Modal from '$lib/core/Modal.svelte';
	import { alertStore } from '$lib/stores/alert';
	import { authStore } from '$lib/stores/auth';
	import { modalStore } from '$lib/stores/modal';
	import { profileStore } from '$lib/stores/profile';
	import type { Models } from 'appwrite';
	import { onMount } from 'svelte';

	let teams: Models.Team[] | undefined = undefined;
	async function reload() {
		teams = undefined;
		try {
			teams = (await AppwriteService.fetchTeams(1)).teams;
		} catch (err: any) {
			alertStore.warning(err.message);
			teams = [];
		}
	}

	onMount(async () => {
		await reload();
	});

	async function onTeamDelete() {
		await reload();
	}

	let newTeamName = '';
	let processingCreate = false;

	async function onCreateTeam() {
		processingCreate = true;

		try {
			await AppwriteService.createTeam(newTeamName);
			alertStore.success('Team created successfully.');
			modalStore.close();
			reload();
			newTeamName = '';
		} catch (err: any) {
			alertStore.warning(err.message);
		} finally {
			processingCreate = false;
		}
	}

	async function onEditSubmit() {
		processingCreate = true;

		try {
			await AppwriteService.updateTeam($modalStore?.data.$id, newTeamName);
			alertStore.success('Team updated successfully.');
			modalStore.close();
			reload();
			newTeamName = '';
		} catch (err: any) {
			alertStore.warning(err.message);
		} finally {
			processingCreate = false;
		}
	}

	function onEditTeam(team: Models.Team) {
		return () => {
			modalStore.open('edit-team', team);
			newTeamName = team.name;
		};
	}

	let scrollY = 0;
	let isLoadingPage = false;
	let currentPage = 1;
	let isEnd = false;

	$: {
		if (scrollY + window.innerHeight + 100 >= document.body.scrollHeight && !isEnd) {
			loadNextPage();
		}
	}

	async function loadNextPage() {
		if (isLoadingPage || !teams || isEnd) {
			return;
		}

		isLoadingPage = true;

		try {
			const newTeams = (await AppwriteService.fetchTeams(currentPage + 1)).teams;
			teams.push(...newTeams);
			teams = teams;

			currentPage++;
		} catch (err: any) {
			isEnd = true;
		} finally {
			isLoadingPage = false;
		}
	}
</script>

<svelte:window bind:scrollY />

<div class="w-full max-w-[770px] mx-auto flex flex-col space-y-10">
	<div
		class="flex flex-col items-start space-y-4 md:space-y-0 md:space-x-4 md:items-center justify-between"
	>
		<div class="flex items-center justify-start space-x-2">
			<img
				class="w-10 rounded-full"
				src={AppwriteService.getAvatar($profileStore?.name).toString()}
				alt="Author profile"
			/>
			<h1 class="text-center font-poppins text-3xl font-semibold text-generic-100">
				{$profileStore?.name}
			</h1>
		</div>

		<div>
			<Button
				on:click={() => modalStore.open('create-team')}
				type="button"
				title="Create team"
				color="primary"
			/>
		</div>
	</div>

	<div class="flex flex-col space-y-8">
		<h2 class="font-poppins text-2xl font-medium text-generic-100">My Teams</h2>

		{#if teams === undefined}
			<Loading />
		{:else if teams.length <= 0}
			<div class="shadow-small p-8 bg-generic-0 rounded-2xl">
				<p class="text-neutral-100 text-base font-normal">
					You have no teams yet. Create a team to collaborate on your posts.
				</p>
			</div>
		{:else if teams.length > 0}
			{#each teams as team}
				<div
					class="shadow-small p-8 bg-generic-0 rounded-2xl flex items-center justify-between space-x-6"
				>
					<a
						href={`/writer/teams/${team.$id}`}
						class="text-neutral-100 text-base font-normal w-full hover:underline">{team.name}</a
					>
					<div class="flex-shrink-0">
						<div class="flex items-center justify-start space-x-2">
							<button on:click={onEditTeam(team)}
								><img src="/icons/edit.svg" alt="Edit icon" /></button
							>
							<div class="w-[1px] h-4 bg-neutral-10" />
							<button on:click={() => modalStore.open('delete-team', team)}
								><img src="/icons/delete.svg" alt="Delete icon" /></button
							>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

<Modal title="Create new Team" type="create-team">
	<form on:submit|preventDefault={onCreateTeam} class="flex flex-col space-y-8">
		<Input
			bind:value={newTeamName}
			validator={InputValidators.team}
			required={true}
			id="team-name"
			placeholder="Enter a Team name"
			type="text"
			title="Name your team"
		/>

		<Button type="submit" color="primary" title="Create Team" loading={processingCreate} />
	</form>
</Modal>

<Modal title="Edit Team" type="edit-team">
	<form on:submit|preventDefault={onEditSubmit} class="flex flex-col space-y-8">
		<Input
			bind:value={newTeamName}
			validator={InputValidators.team}
			required={true}
			id="team-name"
			placeholder="Enter a Team name"
			type="text"
			title="Name your team"
		/>

		<Button type="submit" color="primary" title="Update Team" loading={processingCreate} />
	</form>
</Modal>

<TeamDelete on:delete={onTeamDelete} />
