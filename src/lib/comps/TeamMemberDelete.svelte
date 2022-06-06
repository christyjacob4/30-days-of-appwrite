<script lang="ts">
	import { AppwriteService, type Post } from '$lib/appwrite';
	import { createEventDispatcher } from 'svelte';

	import Loading from '$lib/core/Loading.svelte';
	import Modal from '$lib/core/Modal.svelte';
	import { alertStore } from '$lib/stores/alert';
	import { modalStore } from '$lib/stores/modal';
	import type { Models } from 'appwrite';

	const dispatch = createEventDispatcher();

	let deleteLoading = false;

	function deleteMember(teamId: string, memberId: string) {
		return async () => {
			if (deleteLoading) {
				return;
			}

			deleteLoading = true;

			try {
				await AppwriteService.deleteTeamMembership(teamId, memberId);
				alertStore.success('Member deleted successfully.');
				modalStore.close();
				dispatch('delete');
			} catch (err: any) {
				alertStore.warning(err.message);
			} finally {
				deleteLoading = false;
			}
		};
	}
</script>

<Modal title="Delete Member" type="delete-team-member">
	<p class="text-neutral-100 mb-6">
		Are you sure you want to delete <span class="font-semibold">{$modalStore?.data?.userName}</span
		>?
	</p>

	<div class="flex items-center justify-center space-x-6">
		<button
			on:click={modalStore.close}
			class="w-full py-4 px-6 text-neutral-100 font-semibold bg-generic-0 border border-generic-0 rounded-md"
			>Cancel</button
		>
		<button
			on:click={deleteMember($modalStore?.data.teamId, $modalStore?.data.$id)}
			class="flex items-center justify-center space-x-2  w-full py-4 px-6 text-neutral-100 font-semibold bg-neutral-0 border border-neutral-10 rounded-md"
		>
			{#if deleteLoading}
				<Loading />
			{/if}
			<span>Delete</span>
		</button>
	</div>
</Modal>
