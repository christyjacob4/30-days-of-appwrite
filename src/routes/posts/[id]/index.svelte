<script context="module" lang="ts">
	import {
		AppwriteService,
		type Post as PostType,
		type Profile,
		type Comment
	} from '$lib/appwrite';
	import Post from '$lib/comps/Post.svelte';
	import PostDelete from '$lib/comps/PostDelete.svelte';

	export async function load({ params }: any) {
		const documentId = params.id;
		const post = await AppwriteService.getPostById(documentId);
		const profile = await AppwriteService.getProfileById(post.profileId);
		const comments = await AppwriteService.getComments(documentId, 1);

		const profileIds = [...new Set(comments.documents.map((c) => c.profileId))];
		const commentsProfiles = await AppwriteService.getProfilesByIds(profileIds);

		return {
			props: {
				post,
				profile,
				documentId,
				comments: comments.documents,
				commentsProfiles: commentsProfiles.documents
			}
		};
	}
</script>

<script lang="ts">
	import '../../../../node_modules/easymde/dist/easymde.min.css';

	import { goto } from '$app/navigation';
	import Button from '$lib/core/Button.svelte';
	import { modalStore } from '$lib/stores/modal';
	import { profileStore } from '$lib/stores/profile';
	import { onMount } from 'svelte';
	import { alertStore } from '$lib/stores/alert';
	import { getVerboseDate, markdownToHTML } from '$lib/util';
	import { browser } from '$app/env';
	import { comment } from 'postcss';

	let EasyMDELibrary: any;
	let easyMDE: any;

	export let post: PostType;
	export let profile: Profile;
	export let comments: Comment[];
	export let documentId: string;
	export let commentsProfiles: Profile[];

	function getProfile(profileId: string) {
		return commentsProfiles.find((p) => p.$id === profileId);
	}

	async function onDelete() {
		await goto('/writer/profile');
	}

	onMount(async () => {
		EasyMDELibrary = (await import('easymde')).default;
		easyMDE = new EasyMDELibrary({
			element: document.getElementById('markdown-input') ?? undefined,
			maxHeight: '150px'
		});
	});

	let processingComment = false;
	async function onSubmitComment() {
		if (!$profileStore) {
			return;
		}

		processingComment = true;

		try {
			const content = easyMDE.value();
			await AppwriteService.addComment(documentId, $profileStore.$id, content);
			alertStore.success('Comment posted successfully.');
			easyMDE.value('');

			reload();
		} catch (err: any) {
			alertStore.warning(err.message);
		} finally {
			processingComment = false;
		}
	}

	let scrollY = 0;
	let isLoadingPage = false;
	let currentPage = 1;
	let isEnd = false;

	$: {
		if (browser && scrollY + window.innerHeight + 100 >= document.body.scrollHeight && !isEnd) {
			loadNextPage();
		}
	}

	async function loadNextPage() {
		if (isLoadingPage || isEnd) {
			return;
		}

		isLoadingPage = true;

		try {
			const newComments = await AppwriteService.getComments(documentId, currentPage + 1);
			const profileIds = [...new Set(newComments.documents.map((c) => c.profileId))];
			const newCommentsProfiles = await AppwriteService.getProfilesByIds(profileIds);

			if (newComments.documents.length > 0) {
				currentPage++;
			}

			comments.push(...newComments.documents);
			commentsProfiles.push(...newCommentsProfiles.documents);

			comments = comments;
			commentsProfiles = commentsProfiles;
		} catch (err: any) {
			console.error(err);
			isEnd = true;
		} finally {
			isLoadingPage = false;
		}
	}

	async function reload() {
		if (isLoadingPage) {
			return;
		}

		isLoadingPage = true;

		try {
			const newComments = await AppwriteService.getComments(documentId, currentPage);
			const profileIds = [...new Set(newComments.documents.map((c) => c.profileId))];
			const newCommentsProfiles = await AppwriteService.getProfilesByIds(profileIds);

			comments = newComments.documents;
			commentsProfiles = newCommentsProfiles.documents;

			comments = comments;
			commentsProfiles = commentsProfiles;
		} catch (err: any) {
			isEnd = true;
		} finally {
			isLoadingPage = false;
		}
	}
</script>

<svelte:window bind:scrollY />

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
			readTime={post.readingTime}
			{profile}
		/>
	</div>

	<div class="mt-10 flex flex-col space-y-6">
		<h3 class="uppercase text-generic-100 tracking-widest font-semibold">Comments</h3>

		<form on:submit|preventDefault={onSubmitComment} class="bg-white shadow-small rounded-2xl p-8">
			<h4 class="text-xl font-medium text-neutral-150 font-poppins mb-4">Leave a comment</h4>

			<div class="mb-6">
				<textarea id="markdown-input-comment" />
			</div>

			<div class="flex items-center justify-end space-x-4">
				<Button size="sm" full={false} color="secondary" title="Cancel" />
				<Button
					loading={processingComment}
					type="submit"
					size="sm"
					full={false}
					color="primary"
					title="Submit"
				/>
			</div>
		</form>

		{#if comments && comments.length > 0}
			<section class="flex flex-col space-y-6">
				{#each comments as comment (comment.$id)}
					<div class="bg-white rounded-2xl p-8 shadow-small">
						<div>
							<div class="flex items-center justify-start space-x-2 mb-1">
								<p class="uppercase text-neutral-120 text-xs font-medium tracking-widest">
									{getVerboseDate(comment.createdAt)}
								</p>
							</div>

							<div class="flex items-center justify-start space-x-2">
								<img
									class="w-8 rounded-full"
									src={AppwriteService.getAvatar(getProfile(comment.profileId)?.name).toString()}
									alt="Author profile"
								/>
								<p class="text-neutral-190 font-normal text-sm">
									{getProfile(comment.profileId)?.name}
								</p>
							</div>

							<p class="mt-4">
								{@html markdownToHTML(comment.text)}
							</p>
						</div>
					</div>
				{/each}
			</section>
		{:else}
			<div class="bg-white rounded-2xl p-8 shadow-small">
				<p class="text-neutral-100 text-base font-normal">There are no comments yet.</p>
			</div>
		{/if}
	</div>
</div>

<PostDelete on:delete={onDelete} />
