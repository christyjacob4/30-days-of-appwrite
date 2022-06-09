<script lang="ts">
	import '../../../node_modules/easymde/dist/easymde.min.css';
	import { InputValidators } from '$lib/core/Input';
	import Input from '$lib/core/Input.svelte';
	import { onMount } from 'svelte';
	import Button from '$lib/core/Button.svelte';
	import { AppwriteService, type Post as PostType } from '$lib/appwrite';
	import { alertStore } from '$lib/stores/alert';
	import { goto } from '$app/navigation';
	import Loading from '$lib/core/Loading.svelte';
	import { profileStore } from '$lib/stores/profile';
	import Post from '$lib/comps/Post.svelte';

	export let post: PostType | undefined = undefined;

	let EasyMDELibrary: any;

	let title: string = post ? post.title : '';

	let filesEl: HTMLInputElement;
	let files: FileList | null | undefined = null;

	let preview = false;
	let loading = false;

	let easyMDE: any;
	let content: string = post ? post.text : '';

	$: readTime = getReadTime(content);

	function clearFiles() {
		filesEl.value = '';
		files = null;
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

	function onPublish(type = 'publish') {
		return async () => {
			if (!files) {
				return;
			}

			loading = true;

			try {
				fetchContent();
				let tmpPost;

				if (!post) {
					const file = await AppwriteService.uploadFile(files[0]);
					tmpPost = await AppwriteService.createPost({
						title,
						coverId: file.$id,
						text: content,
						published: type === 'publish',
						profileId: $profileStore?.$id,
						createdAt: Math.round(Date.now() / 1000),
						readingTime: `${readTime} min`
					});
				} else {
					if (files[0]) {
						await AppwriteService.deleteFile(post.coverId);
						const file = await AppwriteService.uploadFile(files[0]);
						post.coverId = file.$id;
					}

					const postId = post.$id;

					post.title = title;
					post.text = content;
					post.published = type === 'publish';
					post.readingTime = `${readTime} min`;

					tmpPost = await AppwriteService.updatePost(postId, post);
				}

				if (type === 'draft') {
					alertStore.success('Draft saved successfully.');
					goto(`/writer/posts/${tmpPost.$id}/edit`);
				} else if (type === 'publish') {
					alertStore.success('Post published successfully.');
					goto(`/posts/${tmpPost.$id}`);
				}
			} catch (err: any) {
				alertStore.warning(err.message);
			} finally {
				loading = false;
			}
		};
	}

	onMount(async () => {
		EasyMDELibrary = (await import('easymde')).default;
		easyMDE = new EasyMDELibrary({
			element: document.getElementById('markdown-input') ?? undefined
		});
		if (post) {
			easyMDE.value(post.text);
		}
	});
</script>

<form class="mx-auto w-full max-w-[770px]" on:submit|preventDefault={onPublish('publish')}>
	<div class={preview ? 'hidden' : 'block'}>
		<section
			class="flex flex-col md:flex-row space-y-6 md:space-y-0 items-center justify-between md:space-x-6"
		>
			<a href="/writer/profile" class="flex items-center space-x-1">
				<img src="/icons/back.svg" alt="Back arrow" />
				<span class="underline text-sm text-generic-100">Back</span>
			</a>

			<div class="flex items-center space-x-4">
				<button
					type="button"
					on:click={onPublish('draft')}
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
					class="flex items-center justify-center space-x-2  py-4 px-5 text-neutral-100 font-semibold border border-neutral-10 rounded-md"
				>
					<span>Preview</span>
				</button>
			</div>
		</section>

		<div class="flex flex-col space-y-10 mt-10">
			<h1 class="font-poppins text-3xl font-semibold text-generic-100">
				{post ? 'Edit post' : 'Create new post'}
			</h1>

			<div class="flex flex-col space-y-6">
				<h2 class="uppercase text-generic-100 tracking-widest font-semibold">Cover image</h2>
				<div class="bg-generic-0 rounded-2xl shadow-small p-8 ">
					{#if post || (files && files[0])}
						<img
							class="rounded-2xl mb-6"
							src={files && files[0]
								? URL.createObjectURL(files[0])
								: AppwriteService.getThumbnail(post?.coverId || '', 1000, 600).toString()}
							alt="Post cover"
						/>
					{/if}
					<div class="flex items-center justify-between space-x-3">
						<input required={post ? false : true} type="file" bind:files bind:this={filesEl} />
						<button type="button" on:click={clearFiles}
							><img src="/icons/cross.svg" alt="Cross icon" /></button
						>
					</div>
				</div>
			</div>

			<div class="flex flex-col space-y-6">
				<h2 class="uppercase text-generic-100 tracking-widest font-semibold">Title</h2>
				<div class="bg-generic-0 rounded-2xl shadow-small p-8">
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
				<div class="bg-generic-0 rounded-2xl shadow-small p-8">
					<textarea id="markdown-input" />
				</div>
			</div>

			<Button {loading} type="submit" title="Publish" color="primary" />
		</div>
	</div>
	<div class={!preview ? 'hidden' : 'block'}>
		<section
			class="flex flex-col md:flex-row space-y-6 md:space-y-0 items-center justify-between md:space-x-6"
		>
			<button type="button" on:click={togglePreview} class="flex items-center space-x-1">
				<img src="/icons/back.svg" alt="Back arrow" />
				<span class="underline text-sm text-generic-100">Continue editing</span>
			</button>

			<div class="flex items-center space-x-4">
				<button
					type="button"
					on:click={onPublish('draft')}
					class="flex items-center justify-center space-x-2 py-4 px-5 text-neutral-100 font-semibold border border-neutral-10 rounded-md"
				>
					{#if loading}
						<Loading />
					{/if}
					<span>Save Draft</span>
				</button>
				<button
					type="button"
					on:click={onPublish('publish')}
					class="flex items-center justify-center space-x-2  py-4 px-5 text-generic-0 font-semibold border border-primary-120 bg-primary-110 rounded-md"
				>
					{#if loading}
						<Loading />
					{/if}
					<span>Publish</span>
				</button>
			</div>
		</section>

		<div class="flex flex-col space-y-10 mt-10">
			<Post
				createdAt={Date.now()}
				file={files && files[0]}
				fileId={post?.coverId}
				{content}
				{title}
				readTime={`${readTime} min`}
				profile={$profileStore}
			/>
		</div>
	</div>
</form>
