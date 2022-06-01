<script lang="ts">
	import Button from '$lib/core/Button.svelte';
	import Loading from '$lib/core/Loading.svelte';
	import { alertStore } from '$lib/stores/alert';
	import { authStore } from '$lib/stores/auth';
	import { profileStore } from '$lib/stores/profile';
	import { AppwriteService, type Post, type Profile } from '$lib/appwrite';
	import { onMount } from 'svelte';
	import Card from '$lib/comps/Card.svelte';

	export let draftPosts: Post[];
	export let publishedPosts: Post[];

	let profiles: Profile[] = [];

	onMount(async () => {
		console.log('Running on mount');
		try {
			const publishedResponse = await AppwriteService.fetchUserPosts(1, true);
			const draftsResponse = await AppwriteService.fetchUserPosts(1, false);

			draftPosts = draftsResponse.documents;
			publishedPosts = publishedResponse.documents;

			const profileIds = [
				...new Set([
					...draftPosts.map((p) => p.profileId),
					...publishedPosts.map((p) => p.profileId)
				])
			];

			profiles = await Promise.all(
				profileIds.map(async (id) => {
					return AppwriteService.getProfileById(id);
				})
			);
		} catch (err: any) {
			console.log('NOW$12');
			alertStore.warning(err.message);
		}
	});

	let emailLoading = false;

	async function onVerifyEmail() {
		emailLoading = true;

		try {
			await AppwriteService.createVerification();
			alertStore.success('Verification email has been send. Please check your inbox.');
		} catch (err: any) {
			console.log('NOW$13');
			alertStore.warning(err.message);
		} finally {
			emailLoading = false;
		}
	}
</script>

<div class="w-full max-w-[770px] mx-auto flex flex-col space-y-10">
	<div class="flex items-center justify-between">
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
			<a href="/create-post"><Button type="button" title="Create post" color="primary" /></a>
		</div>
	</div>

	<div class="grid grid-cols-12 shadow-small p-8 bg-generic-0 rounded-2xl gap-6">
		<div class=" col-span-6 flex flex-col space-y-1">
			<b class="text-base font-bold text-neutral-200">Name</b>
			<p class="font-normal text-base text-neutral-100">{$authStore?.name}</p>
		</div>
		<div class=" col-span-6 flex flex-col space-y-1">
			<b class="text-base font-bold text-neutral-200">Email</b>
			<div class="flex items-center space-x-4">
				<p class="font-normal text-base text-neutral-100 flex-shrink line-clamp-1">
					{$authStore?.email}
				</p>
				{#if $authStore?.emailVerification}
					<div
						class="flex items-center justify-center rounded-full bg-success-10 text-success-120 space-x-1 font-normal text-sm py-2 px-3"
					>
						<img src="/icons/alert-success.svg" alt="Success icon" />
						<span>Verified</span>
					</div>
				{:else}
					<button
						on:click={onVerifyEmail}
						class="flex items-center justify-center rounded-full bg-danger-10 text-danger-120 space-x-1 font-normal text-sm py-2 px-3"
					>
						{#if emailLoading}
							<Loading small={true} />
						{:else}
							<img src="/icons/alert-warning.svg" alt="Warning icon" />
						{/if}
						<span>Unverified</span>
					</button>
				{/if}
			</div>
		</div>
	</div>

	<div class="flex flex-col space-y-8">
		<h2 class="font-poppins text-2xl font-medium text-generic-100">My posts</h2>

		{#if draftPosts === undefined}
			<Loading />
		{:else if draftPosts.length <= 0 && publishedPosts.length <= 0}
			<div class="shadow-small p-8 bg-generic-0 rounded-2xl">
				<p class="text-neutral-100 text-base font-normal">You have no posts yet.</p>
			</div>
		{:else}
			{#if publishedPosts.length > 0}
				<div class="flex flex-col space-y-6">
					<h3 class="uppercase text-generic-100 tracking-widest font-semibold">Published</h3>

					{#each publishedPosts as document, index}
						<Card size="admin" {profiles} {document} {index} />
					{/each}
				</div>
			{/if}

			{#if draftPosts.length > 0}
				<div class="flex flex-col space-y-6">
					<h3 class="uppercase text-generic-100 tracking-widest font-semibold">Drafts</h3>

					{#each draftPosts as document, index}
						<Card size="admin" {profiles} {document} {index} />
					{/each}
				</div>
			{/if}
		{/if}
	</div>
</div>
