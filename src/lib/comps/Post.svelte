<script lang="ts">
	import { AppwriteService, type Profile } from '$lib/appwrite';
	import { getVerboseDate, markdownToHTML } from '$lib/util';

	export let profile: Profile | undefined;
	export let content: string;
	export let readTime: number;
	export let title: string;
	export let file: File;

	$: cover = file ? URL.createObjectURL(file) : undefined;
</script>

<div class="bg-generic-0 shadow-small rounded-2xl p-8">
	{#if cover}
		<img class="w-full rounded-2xl" src={cover} alt="Article cover" />
	{/if}

	<section class="mt-8">
		<div class="flex items-center justify-start space-x-2 mb-2">
			<p class="uppercase text-neutral-120 text-xs font-medium tracking-widest">
				{getVerboseDate(Date.now())}
			</p>
			<div class="w-[1px] h-4 bg-neutral-10" />
			<p class="uppercase text-neutral-120 text-xs font-medium tracking-widest">
				{readTime} min read
			</p>
		</div>

		<h3 class="font-poppins text-2xl font-medium text-neutral-200 mb-2">{title}</h3>

		<div class="flex items-center justify-start space-x-2">
			<img
				class="w-8 rounded-full"
				src={AppwriteService.getAvatar(profile?.name).toString()}
				alt="Author profile"
			/>
			<p class="text-neutral-190 text-base font-normal">{profile?.name}</p>
		</div>

		<p class="line-clamp-1 pt-6 font-normal text-base text-[#827F7F]">
			{@html markdownToHTML(content)}
		</p>
	</section>

	<section class="mt-10 flex items-center justify-start space-x-6">
		<!-- TODO: Functionality to these buttons below -->
		<button> <img src="/icons/facebook.svg" alt="Facebook logo" /></button>
		<button><img src="/icons/twitter.svg" alt="Twitter logo" /></button>
		<button><img src="/icons/linkedin.svg" alt="LinkedIn logo" /></button>
		<button> <img src="/icons/pinterest.svg" alt="Pinterest logo" /></button>
		<button> <img src="/icons/reddit.svg" alt="Reddit logo" /></button>
	</section>
</div>
