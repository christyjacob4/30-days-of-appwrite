<script context="module" lang="ts">
	import { AppwriteService, type Post } from '$lib/appwrite';

	export async function load() {
		// TODO: Button to load more
		const { documents: publishedPosts } = await AppwriteService.fetchPosts(25, 0, [
			Query.equal('published', true)
		]);

		const { documents: draftPosts } = await AppwriteService.fetchPosts(25, 0, [
			Query.equal('published', false)
		]);

		return {
			props: {
				draftPosts,
				publishedPosts
			}
		};
	}
</script>

<script lang="ts">
	import Button from '$lib/core/Button.svelte';
	import { authStore } from '$lib/stores/auth';
	import { profileStore } from '$lib/stores/profile';
	import { Query } from 'appwrite';

	export let draftPosts: Post[];
	export let publishedPosts: Post[];

	function onCreatePost() {
		alert('TODO: Create post');
	}
</script>

<div class="w-full max-w-[770px] mx-auto">
	<div class="flex items-center justify-between mb-10">
		<div class="flex items-center justify-start space-x-2">
			<img
				class="w-10 rounded-full"
				src={AppwriteService.getAvatar($authStore?.name).toString()}
				alt="Author profile"
			/>
			<h1 class="text-center font-poppins text-3xl font-semibold text-generic-100">
				{$profileStore?.name}
			</h1>
		</div>

		<div>
			<Button on:click={onCreatePost} type="button" title="Create post" color="primary" />
		</div>
	</div>

	<div class="grid grid-cols-12 shadow-small p-8 bg-generic-0 rounded-2xl gap-6">
		<div class=" col-span-6 flex flex-col space-y-1">
			<b class="text-base font-bold text-neutral-200">Name</b>
			<p class="font-normal text-base text-neutral-100">{$authStore?.name}</p>
		</div>
		<div class=" col-span-6 flex flex-col space-y-1">
			<b class="text-base font-bold text-neutral-200">Email</b>
			<p class="font-normal text-base text-neutral-100">{$authStore?.email}</p>

			<!-- TODO: Badge and truncate email -->
			<p>{$authStore?.emailVerification}</p>
		</div>
	</div>
</div>
