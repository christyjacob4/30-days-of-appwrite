<script context="module" lang="ts">
	import { AppwriteService, type Post as PostType, type Profile } from '$lib/appwrite';
	import Post from '$lib/comps/Post.svelte';
	import PostDelete from '$lib/comps/PostDelete.svelte';

	export async function load({ params }: any) {
		const documentId = params.id;
		const post = await AppwriteService.getPostById(documentId);
		const profile = await AppwriteService.getProfileById(post.profileId);

		return {
			props: {
				post,
				profile,
				documentId
			}
		};
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { modalStore } from '$lib/stores/modal';
	import { profileStore } from '$lib/stores/profile';

	export let post: PostType;
	export let profile: Profile;
	export let documentId: string;

	async function onDelete() {
		await goto('/writer/profile');
	}
</script>

<div class="mx-auto w-full max-w-[770px]">
	<section class="flex items-center justify-between space-x-10">
		<a href="/" class="flex items-center space-x-1">
			<img src="/icons/back.svg" alt="Back arrow" />
			<span class="underline text-sm text-generic-100">Back</span>
		</a>

		{#if $profileStore?.$id === profile.$id}
			<div class="flex items-center space-x-4">
				<a
					href={`/writer/posts/${documentId}/edit`}
					class="flex items-center justify-center space-x-2 py-4 px-5 text-neutral-100 font-semibold border border-neutral-10 rounded-md"
				>
					<span>Edit post</span>
				</a>
				<button
					type="button"
					on:click={() => modalStore.open('delete-post', post)}
					class="flex items-center justify-center space-x-2  py-4 px-5 text-neutral-0 font-semibold border border-neutral-10 bg-neutral-150 rounded-md"
				>
					<span>Delete</span>
				</button>
			</div>
		{/if}
	</section>

	<div class="flex flex-col space-y-10 mt-10">
		<Post
			fileId={post.coverId}
			content={post.text}
			title={post.title}
			readTime={+(post.readingTime || 0)}
			{profile}
		/>
	</div>

	<!-- TODO: Comment section -->
</div>

<PostDelete on:delete={onDelete} />
