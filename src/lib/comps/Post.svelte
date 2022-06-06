<script lang="ts">
	import { AppwriteService, type Profile } from '$lib/appwrite';
	import { getVerboseDate, markdownToHTML } from '$lib/util';

	export let profile: Profile | undefined;
	export let content: string;
	export let readTime: string;
	export let title: string;

	export let file: File | undefined = undefined;
	export let fileId: string | undefined = undefined;

	$: cover = file
		? URL.createObjectURL(file)
		: AppwriteService.getThumbnail(fileId || '', 1000, 500).toString();

	const fbs_click = () => {
		window.open(
			`http://www.facebook.com/sharer.php?u=${window.location.href}&quote=${title}`,
			'sharer',
			'toolbar=0,status=0,width=626,height=436'
		);
		return false;
	};
	const tbs_click = () => {
		window.open(
			`https://twitter.com/intent/tweet?text=${title}&url=${window.location.href}`,
			'sharer',
			'toolbar=0,status=0,width=626,height=436'
		);
		return false;
	};
	const lbs_click = () => {
		window.open(
			`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`,
			'sharer',
			'toolbar=0,status=0,width=626,height=436'
		);
		return false;
	};
	const rbs_click = () => {
		window.open(
			`https://www.reddit.com/submit?url=${window.location.href}&title=${title}`,
			'sharer',
			'toolbar=0,status=0,width=626,height=436'
		);
		return false;
	};
	const pbs_click = () => {
		window.open(
			`https://www.pinterest.com/pin/create/button/?&text=${title}&url=${window.location.href}&description=${title}`,
			'sharer',
			'toolbar=0,status=0,width=626,height=436'
		);
		return false;
	};
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

		<div class="prose pt-6 font-normal text-base text-[#827F7F]">
			{@html markdownToHTML(content)}
		</div>
	</section>

	<section class="mt-10 flex items-center justify-start space-x-6">
		<button on:click={fbs_click}> <img src="/icons/facebook.svg" alt="Facebook logo" /></button>
		<button on:click={tbs_click}><img src="/icons/twitter.svg" alt="Twitter logo" /></button>
		<button on:click={lbs_click}><img src="/icons/linkedin.svg" alt="LinkedIn logo" /></button>
		<button on:click={pbs_click}> <img src="/icons/pinterest.svg" alt="Pinterest logo" /></button>
		<button on:click={rbs_click}> <img src="/icons/reddit.svg" alt="Reddit logo" /></button>
	</section>
</div>
