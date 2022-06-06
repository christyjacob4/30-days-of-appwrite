<script lang="ts">
	import { page } from '$app/stores';

	import { AppwriteService, type Post } from '$lib/appwrite';

	import PostEditor from '$lib/comps/PostEditor.svelte';
	import Loading from '$lib/core/Loading.svelte';
	import { alertStore } from '$lib/stores/alert';
	import { onMount } from 'svelte';

	let post: Post | undefined | null = undefined;

	onMount(async () => {
		try {
			post = await AppwriteService.getPostById($page.params.id);
		} catch (err: any) {
			alertStore.warning(err.message);
			post = null;
		}
	});
</script>

{#if post === undefined}
	<Loading />
{:else if post === null}
	<p class="text-neutral-50 font-normal text-base text-left w-full">
		Error occured when loading the post.
	</p>
{:else}
	<PostEditor {post} />
{/if}
