<script lang="ts">
	import { goto } from '$app/navigation';

	import { AppwriteService, type Post, type Profile } from '$lib/appwrite';
	import { modalStore } from '$lib/stores/modal';
	import { getVerboseDate, markdownToText } from '$lib/util';

	export let size: 'sm' | 'md' | 'lg' | 'admin';
	export let index: number;
	export let document: Post;
	export let profiles: Profile[];

	$: position = index + 1 < 10 ? `0${index + 1}` : index + 1;
	$: profile = profiles.find((p) => p.$id === document.profileId);

	function onCardClick() {
		if (size !== 'lg' && size !== 'admin') {
			goto(`/posts/${document.$id}`);
		}
	}

	function deletePost(document: Post) {
		return () => {
			modalStore.open('delete-post', document);
		};
	}
</script>

<div
	on:click={onCardClick}
	class={`bg-generic-0 shadow-small p-8 rounded-2xl ${
		size !== 'lg' && size !== 'admin' ? 'cursor-pointer' : ''
	}`}
>
	<!-- This helps Svelte Kit Crawler to discover our post page during SSG -->
	<a href={`/posts/${document.$id}`} class="hidden">[SSG_LINK]</a>

	{#if size === 'sm'}
		<div class="flex items-start justify-start space-x-4">
			<span class="text-primary-50 text-3xl font-bold font-poppins opacity-70">{position}</span>

			<div>
				<div class="flex items-center justify-start space-x-2 mb-1">
					<p class="uppercase text-neutral-120 text-xs font-medium tracking-widest">
						{getVerboseDate(document.createdAt)}
					</p>
					<div class="w-[1px] h-4 bg-neutral-10" />
					<p class="uppercase text-neutral-120 text-xs font-medium tracking-widest">
						{document.readingTime} read
					</p>
				</div>
				<div class="mb-2">
					<h3 class="font-poppins line-clamp-1 text-lg font-medium text-neutral-200">
						{document.title}
					</h3>
				</div>

				<div class="flex items-center justify-start space-x-2">
					<img
						class="w-8 rounded-full"
						src={AppwriteService.getAvatar(profile?.name).toString()}
						alt="Author profile"
					/>
					<p class="text-neutral-190 font-normal text-sm">{profile?.name}</p>
				</div>
			</div>
		</div>
	{:else if size === 'md'}
		<div class="flex flex-col space-y-6 md:flex-row items-start justify-start md:space-x-6">
			<img
				class="flex-shrink-0 w-full md:max-w-[150px] h-auto rounded-lg"
				src={AppwriteService.getThumbnail(document.coverId, 1000, 1000).toString()}
				alt="Article cover"
			/>

			<div class="w-full">
				<div class="flex items-center justify-start space-x-2 mb-1">
					<p class="uppercase text-neutral-120 text-xs font-medium tracking-widest">
						{getVerboseDate(document.createdAt)}
					</p>
					<div class="w-[1px] h-4 bg-neutral-10" />
					<p class="uppercase text-neutral-120 text-xs font-medium tracking-widest">
						{document.readingTime} read
					</p>
				</div>

				<div class="mb-2">
					<h3 class="font-poppins line-clamp-1 text-lg font-medium text-neutral-200 ">
						{document.title}
					</h3>
				</div>

				<div class="flex items-center justify-start space-x-2">
					<img
						class="w-8 rounded-full"
						src={AppwriteService.getAvatar(profile?.name).toString()}
						alt="Author profile"
					/>
					<p class="text-neutral-190 font-normal text-sm">{profile?.name}</p>
				</div>

				<div class="pt-6">
					<p class="line-clamp-1  font-normal text-sm text-[#827F7F]">
						{markdownToText(document.text)}
					</p>
				</div>
			</div>
		</div>
	{:else if size === 'admin'}
		<div class="flex flex-col space-y-6 md:flex-row items-start justify-start md:space-x-6">
			<img
				class="flex-shrink-0 w-full md:max-w-[150px] h-auto rounded-lg"
				src={AppwriteService.getThumbnail(document.coverId, 1000, 600).toString()}
				alt="Article cover"
			/>

			<div class="w-full flex items-start justify-start space-x-6">
				<div class="w-full">
					<div class="mb-2">
						<h3 class="line-clamp-2 font-poppins text-lg font-medium text-neutral-200 ">
							{document.title}
						</h3>
					</div>
					<div class="flex items-center justify-start space-x-2 mb-1">
						<p class="uppercase text-neutral-120 text-xs font-medium tracking-widest">
							posted {getVerboseDate(document.createdAt)}
						</p>
					</div>
				</div>
				<div class="flex-shrink-0">
					<div class="flex items-center justify-start space-x-2">
						<a href={`/writer/posts/${document.$id}/edit`}
							><img src="/icons/edit.svg" alt="Edit icon" /></a
						>
						<div class="w-[1px] h-4 bg-neutral-10" />
						<button on:click={deletePost(document)}
							><img src="/icons/delete.svg" alt="Delete icon" /></button
						>
					</div>
				</div>
			</div>
		</div>
	{:else if size === 'lg'}
		<div class="grid grid-cols-12 gap-6">
			<div class="col-span-12 md:col-span-6 h-full w-full rounded-2xl overflow-hidden">
				<img
					class="w-full h-full object-cover object-center"
					src={AppwriteService.getThumbnail(document.coverId, 1000, 550).toString()}
					alt="Article cover"
				/>
			</div>

			<div class="col-span-12 md:col-span-6">
				<div class="flex items-center justify-start space-x-2 mb-1">
					<p class="uppercase text-neutral-120 text-xs font-medium tracking-widest">
						{getVerboseDate(document.createdAt)}
					</p>
					<div class="w-[1px] h-4 bg-neutral-10" />
					<p class="uppercase text-neutral-120 text-xs font-medium tracking-widest">
						{document.readingTime} read
					</p>
				</div>

				<div class="mb-2">
					<h3 class="font-poppins line-clamp-1 text-lg font-medium text-neutral-200">
						{document.title}
					</h3>
				</div>

				<div class="flex items-center justify-start space-x-2">
					<img
						class="w-8 rounded-full"
						src={AppwriteService.getAvatar(profile?.name).toString()}
						alt="Author profile"
					/>
					<p class="text-neutral-190 font-normal text-sm">{profile?.name}</p>
				</div>

				<div class="py-6">
					<p class="line-clamp-3 font-normal text-base text-[#827F7F]">
						{markdownToText(document.text)}
					</p>
				</div>

				<a
					href={`/posts/${document.$id}`}
					class="w-[fit-content] border border-primary-120 bg-primary-110 hover:bg-primary-120 rounded-md py-3 px-5 flex items-center justify-center space-x-1"
				>
					<span class="text-neutral-0 font-semibold text-base"> Read More </span>

					<img src="/icons/arrow.svg" alt="Arrow icon" />
				</a>
			</div>
		</div>
	{/if}
</div>
