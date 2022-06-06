<script context="module" lang="ts">
	import { AppwriteService } from '$lib/appwrite';

	export async function load() {
		const { documents: posts } = await AppwriteService.fetchPosts(1, true);

		const promoted = posts[0];
		const featured = posts.slice(1, 5);
		const latest = posts.slice(5);

		const profileIds = [...new Set(posts.map((p) => p.profileId))];
		const profiles = await AppwriteService.getProfilesByIds(profileIds);

		return {
			props: {
				promoted,
				featured,
				latest,
				profiles: profiles.documents
			}
		};
	}
</script>

<script lang="ts">
	import type { Post, Profile } from '$lib/appwrite';
	import Card from '$lib/comps/Card.svelte';
	import { browser } from '$app/env';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { modalStore } from '$lib/stores/modal';

	export let promoted: Post;
	export let featured: Post[];
	export let latest: Post[];
	export let profiles: Profile[];

	let scrollY = 0;
	let isLoadingPage = false;
	let currentPage = 1;
	let isEnd = false;

	$: {
		if (browser && scrollY + window.innerHeight + 100 >= document.body.scrollHeight && !isEnd) {
			loadNextPage();
		}
	}

	onMount(async () => {
		let userId = $page.url.searchParams.get('userId');
		let secret = $page.url.searchParams.get('secret');

		if (userId && secret) {
			modalStore.open('forgot-password-finish');
		}
	});

	async function loadNextPage() {
		if (isLoadingPage || isEnd) {
			return;
		}

		currentPage++;
		isLoadingPage = true;

		try {
			const { documents: posts } = await AppwriteService.fetchPosts(currentPage, true);
			latest.push(...posts);
			latest = latest;
		} catch (err: any) {
			isEnd = true;
			currentPage--;
		} finally {
			isLoadingPage = false;
		}
	}
</script>

<svelte:window bind:scrollY />

<div class="flex flex-col space-y-10">
	{#if promoted}
		<Card size="lg" {profiles} document={promoted} index={0} />
	{/if}

	<section class="flex flex-col space-y-6">
		<h2 class="uppercase font-semibold text-base tracking-widest text-generic-100">popular</h2>

		<div class="grid grid-cols-12 gap-6">
			{#each featured as document, index}
				<div class="col-span-6">
					<Card size="sm" {profiles} {document} {index} />
				</div>
			{/each}
			{#if !featured || featured.length <= 0}
				<p class="col-span-12 text-neutral-50 font-normal text-base text-left w-full">
					There are no featured posts yet.
				</p>
			{/if}
		</div>
	</section>

	<section class="flex flex-col space-y-6">
		<h2 class="uppercase font-semibold text-base tracking-widest text-generic-100">recent posts</h2>

		<div class="grid grid-cols-12 gap-6">
			{#each latest as document, index}
				<div class="col-span-12">
					<Card size="md" {profiles} {document} {index} />
				</div>
			{/each}
			{#if !featured || featured.length <= 0}
				<p class="col-span-12 text-neutral-50 font-normal text-base text-left w-full">
					There are no recent posts yet.
				</p>
			{/if}
		</div>
	</section>
</div>
