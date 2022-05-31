<script lang="ts">
	import { goto } from '$app/navigation';

	import { AppwriteService, type Post, type Profile } from '$lib/appwrite';

	export let size: 'sm' | 'md' | 'lg';
	export let index: number;
	export let document: Post;
	export let profiles: Profile[];

	$: position = index + 1 < 10 ? `0${index + 1}` : index + 1;
	$: profile = profiles.find((p) => p.user === document.user_id);

	function getVerboseDate(timestamp: number) {
		const monthNames = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
		];

		const date = new Date(timestamp);

		return `${monthNames[date.getMonth()]} ${date.getDate()}`;
	}

	function onCardClick() {
		if (size !== 'lg') {
			goto(`/posts/${document.$id}`);
		}
	}
</script>

<div
	on:click={onCardClick}
	class={`bg-generic-0 shadow-small p-8 rounded-2xl ${size !== 'lg' ? 'cursor-pointer' : ''}`}
>
	<!-- This helps Svelte Kit Crawler to discover our post page during SSG -->
	<a href={`/posts/${document.$id}`} class="hidden">[SSG_LINK]</a>

	{#if size === 'sm'}
		<div class="flex items-start justify-start space-x-4">
			<span class="text-primary-50 text-3xl font-bold font-poppins opacity-70">{position}</span>

			<div>
				<div class="flex items-center justify-start space-x-2 mb-1">
					<p class="uppercase text-neutral-120 text-xs font-medium tracking-widest">
						{getVerboseDate(document.created_at)}
					</p>
					<div class="w-[1px] h-4 bg-neutral-10" />
					<p class="uppercase text-neutral-120 text-xs font-medium tracking-widest">
						{document.readingTime} read
					</p>
				</div>

				<h3 class="font-poppins text-lg font-medium text-neutral-200 mb-2">{document.title}</h3>

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
		<div class="flex items-start justify-start space-x-6">
			{#if document.cover}
				<img
					class="flex-shrink-0 w-full max-w-[150px] h-auto rounded-lg"
					src={AppwriteService.getThumbnail(document.cover, 1000, 1000).toString()}
					alt="Article cover"
				/>
			{/if}

			<div class="w-full">
				<div class="flex items-center justify-start space-x-2 mb-1">
					<p class="uppercase text-neutral-120 text-xs font-medium tracking-widest">
						{getVerboseDate(document.created_at)}
					</p>
					<div class="w-[1px] h-4 bg-neutral-10" />
					<p class="uppercase text-neutral-120 text-xs font-medium tracking-widest">
						{document.readingTime} read
					</p>
				</div>

				<h3 class="font-poppins text-lg font-medium text-neutral-200 mb-2">{document.title}</h3>

				<div class="flex items-center justify-start space-x-2">
					<img
						class="w-8 rounded-full"
						src={AppwriteService.getAvatar(profile?.name).toString()}
						alt="Author profile"
					/>
					<p class="text-neutral-190 font-normal text-sm">{profile?.name}</p>
				</div>

				<p class="line-clamp-1 pt-6 font-normal text-sm text-[#827F7F]">{document.text}</p>
			</div>
		</div>
	{:else if size === 'lg'}
		<div class="grid grid-cols-12 gap-6">
			{#if document.cover}
				<div class="col-span-6 h-full w-full rounded-2xl overflow-hidden">
					<img
						class="w-full h-full object-cover object-center"
						src={AppwriteService.getThumbnail(document.cover, 1000, 550).toString()}
						alt="Article cover"
					/>
				</div>
			{/if}

			<div class="col-span-6">
				<div class="flex items-center justify-start space-x-2 mb-1">
					<p class="uppercase text-neutral-120 text-xs font-medium tracking-widest">
						{getVerboseDate(document.created_at)}
					</p>
					<div class="w-[1px] h-4 bg-neutral-10" />
					<p class="uppercase text-neutral-120 text-xs font-medium tracking-widest">
						{document.readingTime} read
					</p>
				</div>

				<h3 class="font-poppins text-lg font-medium text-neutral-200 mb-2">{document.title}</h3>

				<div class="flex items-center justify-start space-x-2">
					<img
						class="w-8 rounded-full"
						src={AppwriteService.getAvatar(profile?.name).toString()}
						alt="Author profile"
					/>
					<p class="text-neutral-190 font-normal text-sm">{profile?.name}</p>
				</div>

				<p class="line-clamp-3 py-6 font-normal text-base text-[#827F7F]">{document.text}</p>

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
