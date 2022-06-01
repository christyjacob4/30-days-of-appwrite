<script lang="ts">
	import '../../../node_modules/easymde/dist/easymde.min.css';
	import { InputValidators } from '$lib/core/Input';
	import Input from '$lib/core/Input.svelte';
	import { onMount } from 'svelte';
	import Button from '$lib/core/Button.svelte';
	import { AppwriteService } from '$lib/appwrite';
	import { alertStore } from '$lib/stores/alert';
	import { goto } from '$app/navigation';
	import Loading from '$lib/core/Loading.svelte';
	import { profileStore } from '$lib/stores/profile';
	import Post from '$lib/comps/Post.svelte';

	let EasyMDELibrary: any;

	let title: string = '';
	let filesEl: HTMLInputElement;
	let files: any[] = [];

	let preview = false;
	let loading = false;

	let easyMDE: any;
	let content: string = '';

	$: readTime = getReadTime(content);

	function clearFiles() {
		filesEl.value = '';
	}

	function fetchContent() {
		content = easyMDE.value();
	}

	function togglePreview() {
		fetchContent();
		preview = !preview;
	}

	function getReadTime(content: string) {
		const wpm = 225;
		const words = content.trim().split(/\s+/).length;
		const readingTime = Math.ceil(words / wpm);

		return readingTime;
	}

	async function onPublish() {
		let type = 'publish'; // TODO: Figure out type from button (publish/draft)

		loading = true;

		try {
			fetchContent();

			const file = await AppwriteService.uploadFile(files[0]);

			const post = await AppwriteService.createPost({
				title,
				cover: file.$id,
				text: content,
				published: type === 'publish',
				profileId: $profileStore?.$id,
				createdAt: Date.now(),
				readingTime: `${readTime} min`
			});

			if (type === 'draft') {
				alertStore.success('Draft saved successfully.');
				goto(`/posts/${post.$id}/edit`);
			} else if (type === 'publish') {
				alertStore.success('Post published successfully.');
				goto(`/posts/${post.$id}`);
			}
		} catch (err: any) {
			console.log('NOW$10');
			alertStore.warning(err.message);
		} finally {
			loading = false;
		}
	}

	onMount(async () => {
		EasyMDELibrary = (await import('easymde')).default;
		easyMDE = new EasyMDELibrary({
			element: document.getElementById('markdown-input') ?? undefined
		});
	});
</script>

<form class="mx-auto w-full max-w-[770px]" on:submit|preventDefault={onPublish}>
	<div class={preview ? 'hidden' : 'block'}>
		<section class="flex items-center justify-between space-x-10">
			<a href="/writer/profile" class="flex items-center space-x-1">
				<img src="/icons/back.svg" alt="Back arrow" />
				<span class="underline text-sm text-generic-100">Back</span>
			</a>

			<div class="flex items-center space-x-4">
				<button
					type="submit"
					name="draft"
					class="flex items-center justify-center space-x-2 py-4 px-5 text-neutral-100 font-semibold border border-neutral-10 border-opacity-0 rounded-md"
				>
					{#if loading}
						<Loading />
					{/if}
					<span>Save Draft</span>
				</button>
				<button
					on:click={togglePreview}
					type="button"
					name="preview"
					class="flex items-center justify-center space-x-2  py-4 px-5 text-neutral-100 font-semibold border border-neutral-10 rounded-md"
				>
					<span>Preview</span>
				</button>
			</div>
		</section>

		<div class="flex flex-col space-y-10 mt-10">
			<h1 class="font-poppins text-3xl font-semibold text-generic-100">Create new post</h1>

			<div class="flex flex-col space-y-6">
				<h2 class="uppercase text-generic-100 tracking-widest font-semibold">Cover image</h2>
				<div
					class="bg-white rounded-2xl shadow-small p-8 flex items-center justify-between space-x-3"
				>
					<input required={true} type="file" bind:files bind:this={filesEl} />
					<button type="button" on:click={clearFiles}
						><img src="/icons/cross.svg" alt="Cross icon" /></button
					>
				</div>
			</div>

			<div class="flex flex-col space-y-6">
				<h2 class="uppercase text-generic-100 tracking-widest font-semibold">Title</h2>
				<div class="bg-white rounded-2xl shadow-small p-8">
					<Input
						bind:value={title}
						validator={InputValidators.title}
						required={true}
						id="title"
						placeholder="Title"
						type="text"
						title="Give your post a title"
					/>
				</div>
			</div>

			<div class="flex flex-col space-y-6">
				<h2 class="uppercase text-generic-100 tracking-widest font-semibold">Content</h2>
				<div class="bg-white rounded-2xl shadow-small p-8">
					<textarea id="markdown-input" />
				</div>
			</div>

			<Button {loading} name="publish" type="submit" title="Publish" color="primary" />
		</div>
	</div>
	<div class={!preview ? 'hidden' : 'block'}>
		<section class="flex items-center justify-between space-x-10">
			<button type="button" on:click={togglePreview} class="flex items-center space-x-1">
				<img src="/icons/back.svg" alt="Back arrow" />
				<span class="underline text-sm text-generic-100">Continue editing</span>
			</button>

			<div class="flex items-center space-x-4">
				<button
					type="submit"
					name="draft"
					class="flex items-center justify-center space-x-2 py-4 px-5 text-neutral-100 font-semibold border border-neutral-10 border-opacity-0 rounded-md"
				>
					{#if loading}
						<Loading />
					{/if}
					<span>Save Draft</span>
				</button>
				<button
					on:click={() => (preview = true)}
					type="button"
					name="preview"
					class="flex items-center justify-center space-x-2  py-4 px-5 text-generic-0 font-semibold border border-primary-120 bg-primary-110 rounded-md"
				>
					<span>Publish</span>
				</button>
			</div>
		</section>

		<div class="flex flex-col space-y-10 mt-10">
			<Post file={files[0]} {content} {title} {readTime} profile={$profileStore} />
		</div>
	</div>
</form>
