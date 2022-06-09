<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { AppwriteService } from '$lib/appwrite';

	import TeamDelete from '$lib/comps/TeamDelete.svelte';
	import TeamMemberDelete from '$lib/comps/TeamMemberDelete.svelte';
	import Button from '$lib/core/Button.svelte';
	import { InputValidators } from '$lib/core/Input';
	import Input from '$lib/core/Input.svelte';
	import Loading from '$lib/core/Loading.svelte';
	import Modal from '$lib/core/Modal.svelte';
	import { alertStore } from '$lib/stores/alert';
	import { authStore } from '$lib/stores/auth';
	import { modalStore } from '$lib/stores/modal';
	import { getVerboseDate } from '$lib/util';
	import type { Models } from 'appwrite';
	import { onMount } from 'svelte';

	let team: Models.Team | undefined;
	let members: Models.Membership[] | undefined;
	let isOwner: boolean = false;

	async function reload() {
		try {
			team = await AppwriteService.getTeamById($page.params.id);
			members = (await AppwriteService.listTeamMembers(team.$id, 1)).memberships;
			isOwner = members.find((m) => m.userId === $authStore?.$id)?.roles.includes('owner') ?? false;
		} catch (err: any) {
			alertStore.warning(err.message);
		}
	}

	onMount(async () => {
		await reload();
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
			reload();
		} catch (err: any) {
			alertStore.warning(err.message ? err.message : err);
		} finally {
			processingMemberCreate = false;
		}
	}

	function capitalizeFirstLetter(string: string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
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
		if (isLoadingPage || isEnd || !team || !members) {
			return;
		}

		isLoadingPage = true;

		try {
			const newMembers = (await AppwriteService.listTeamMembers(team.$id, currentPage + 1))
				.memberships;

			members.push(...newMembers);
			members = members;

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
	{#if team}
		<div
			class="flex flex-col items-start space-y-4 md:space-y-0 md:space-x-4 md:items-center justify-between md:flex-row"
		>
			<div class="flex items-center justify-start space-x-2 w-full">
				<h1 class="line-clamp-1 text-center font-poppins text-3xl font-semibold text-generic-100">
					{team.name}
				</h1>
			</div>

			<div class="flex space-x-4 items-center justify-end flex-shrink-0">
				<Button
					on:click={() => modalStore.open('delete-team', team)}
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

			{#if members}
				{#each members as member}
					<div class="bg-generic-0 rounded-2xl shadow-sm p-8 flex flex-col space-y-6">
						<div
							class="flex flex-col md:flex-row space-y-3 md:space-y-0 items-start md:items-center justify-between md:space-x-3"
						>
							<div class="flex items-center justify-start space-x-2">
								<img
									class="w-10 rounded-full"
									src={AppwriteService.getAvatar(member.userName).toString()}
									alt="Author profile"
								/>
								<h1 class="text-center font-poppins text-xl font-medium text-neutral-200">
									{member.userName}
								</h1>
							</div>

							<div class="flex items-center justify-center space-x-2">
								<div class="bg-secondary-10 text-secondary-120 rounded-full px-3 py-2 text-sm">
									{capitalizeFirstLetter(member.roles[0])}
								</div>

								{#if !member.confirm}
									<div class="bg-warning-10 text-warning-120 rounded-full px-3 py-2 text-sm">
										Pending Invite
									</div>
								{/if}
							</div>
						</div>

						<div class="flex flex-col space-y-4">
							<div class="flex flex-col space-y-0">
								<h4 class="text-neutral-200 font-bold">Email</h4>
								<p class="text-neutral-100">{member.userEmail}</p>
							</div>

							<div class="flex flex-col space-y-0">
								<h4 class="text-neutral-200 font-bold">Invited On</h4>
								<p class="text-neutral-100">{getVerboseDate(member.invited, true)}</p>
							</div>

							<div class="flex flex-col space-y-0">
								<h4 class="text-neutral-200 font-bold">Joined On</h4>
								<p class="text-neutral-100">
									{member.joined ? getVerboseDate(member.joined, true) : 'Not yet joined.'}
								</p>
							</div>
						</div>

						{#if isOwner}
							<div class="flex justify-end">
								<Button
									on:click={() => modalStore.open('delete-team-member', member)}
									size="sm"
									color="secondary"
									title="Delete User"
									type="button"
									full={false}
								/>
							</div>
						{/if}
					</div>
				{/each}
			{:else}
				<Loading />
			{/if}
		</div>
	{:else}
		<Loading />
	{/if}
</div>

<TeamDelete on:delete={onTeamDelete} />
<TeamMemberDelete on:delete={reload} />

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
