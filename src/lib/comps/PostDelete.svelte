<script lang="ts">
	import { AppwriteService, type Post } from '$lib/appwrite';
	import { createEventDispatcher } from 'svelte';

	import Loading from '$lib/core/Loading.svelte';
	import Modal from '$lib/core/Modal.svelte';
	import { alertStore } from '$lib/stores/alert';
	import { modalStore } from '$lib/stores/modal';

	const dispatch = createEventDispatcher();

	let deleteLoading = false;
	function deletePost(document: Post) {
		return async () => {
			deleteLoading = true;
			try {
				await AppwriteService.deletePost(document);
				alertStore.success('Post deleted successfully.');
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

<Modal title="Delete post" type="delete-post">
	<p class="text-neutral-100 mb-6">
		Are you sure you want to delete <span class="font-semibold">{$modalStore?.data?.title}</span>?
	</p>

	<div class="flex items-center justify-center space-x-6">
		<button
			on:click={modalStore.close}
			class="w-full py-4 px-6 text-neutral-100 font-semibold bg-generic-0 border border-generic-0 rounded-md"
			>Cancel</button
		>
		<button
			on:click={deletePost($modalStore?.data)}
			class="flex items-center justify-center space-x-2  w-full py-4 px-6 text-neutral-100 font-semibold bg-neutral-0 border border-neutral-10 rounded-md"
		>
			{#if deleteLoading}
				<Loading />
			{/if}
			<span>Delete</span>
		</button>
	</div>
</Modal>
