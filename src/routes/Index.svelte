<script context="module" lang="ts">
	import { AppwriteService } from '$lib/appwrite';

	export async function load() {
		// TODO: Button to load more
		const { documents: posts } = await AppwriteService.fetchPosts(25, 0, [
			Query.equal('published', true)
		]);

		const promoted = posts[0];
		const featured = posts.slice(1, 5);
		const latest = posts.slice(5);

		const profileIds = [...new Set(posts.map((p) => p.user_id))];
		const profiles = await Promise.all(
			profileIds.map(async (id) => {
				return AppwriteService.getProfile(id);
			})
		);

		return {
			props: {
				promoted,
				featured,
				latest,
				profiles
			}
		};
	}
</script>

<script lang="ts">
	import type { Post, Profile } from '$lib/appwrite';
	import Card from '$lib/comps/Card.svelte';
	import { Query } from 'appwrite';

	export let promoted: Post;
	export let featured: Post[];
	export let latest: Post[];
	export let profiles: Profile[];
</script>

<div class="flex flex-col space-y-10">
	<Card size="lg" {profiles} document={promoted} index={0} />

	<section class="flex flex-col space-y-6">
		<h2 class="uppercase font-semibold text-base tracking-widest text-generic-100">popular</h2>

		<div class="grid grid-cols-12 gap-6">
			{#each featured as document, index}
				<div class="col-span-6">
					<Card size="sm" {profiles} {document} {index} />
				</div>
			{/each}
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
		</div>
	</section>
</div>
