<script>
    import EasyMDE from "easymde";
    import { api } from "../appwrite";
    import { state } from "../store";
    import { onMount } from "svelte";
    import { replace } from "svelte-spa-router";
    import "../../node_modules/easymde/dist/easymde.min.css";
    import Loading from "../lib/Loading.svelte";

    export let params = {};

    let published = false,
        title = "",
        files,
        easyMDE,
        message = "",
        loading = false,
        cover,
        post,
        content = "";

    let postFetch = async () => {
        post = await api.fetchPost(params.slug);
        title = post.title;
        easyMDE.value(post.text);
        cover = post.cover;
    };
    onMount(() => {
        if (params.slug) {
            postFetch();
        }
        easyMDE = new EasyMDE({
            element: document.getElementById("content"),
            renderingConfig: {
                singleLineBreaks: true,
            },
        });
    });
    const submit = async () => {
        message = "";
        loading = true;

        if (files && files.length == 1) {
            if (params.slug) {
                await api.deleteFile(cover);
            }
            let file = await api.uploadFile(files[0], $state.user.$id);
            cover = file.$id;
        }
        let content = easyMDE.value();
        if (title.trim() == "" || content.trim() == "") {
            message = "Title and content are both required";
            console.log("title and content are both required");
            loading = false;
            return;
        }
        console.log({
            title: title,
            text: content,
            published: published,
            user: $state.user.$id,
            profile: $state.profile.$id,
            cover: cover,
        });
        try {
            let data = {
                title: title,
                text: content,
                published: published,
                user_id: $state.user.$id,
                created_at: params.slug
                    ? post.created_at
                    : new Date().getTime(),
                cover: cover,
            };
            if (params.slug) {
                //update
                await api.updatePost(params.slug, data, $state.user.$id);
                replace("/profile/" + $state.user.$id);
            } else {
                await api.createPost(data, $state.user.$id, $state.profile.$id);
                easyMDE.value("");
                title = "";
                content = "";
                files = [];
                console.log("post created successfully");
                message = "Post created successfully";
            }
        } catch (error) {
            console.log(error);
            message = error;
        } finally {
            loading = false;
        }
    };
</script>

<section>
    {#if params.slug}
        <h2>Edit Post</h2>
    {:else}
        <h2>Create Post</h2>
    {/if}
    {#if message}
        <div class="alert">{message}</div>
    {/if}
    <form class="create-form" on:submit|preventDefault={submit}>
        <label for="cover">Cover</label>
        <input type="file" bind:files />
        {#if cover}
            <img class="cover" src={api.getThumbnail(cover, 400, 250)} alt="" />
        {/if}
        <label for="title">Title</label>
        <input
            required
            type="text"
            placeholder="Enter title"
            bind:value={title} />
        <label for="content">Content</label>
        <textarea
            bind:value={content}
            name="content"
            id="content"
            cols="30"
            rows="10"
            placeholder="Enter content" />
        <label for="status">Status</label>
        <select name="status" id="status" bind:value={published}>
            <option value={false}>Draft</option>
            <option value={true}>Published</option>
        </select>
        <button disabled={loading ? true : false} class="button" type="submit"
            >{params.slug ? "Save" : "Create"}</button>
    </form>
</section>

<style>
    .create-form {
        display: flex;
        flex-direction: column;
        padding: 16px;
        border: 1px solid #eee;
        border-radius: 8px;
    }
    label {
        margin-top: 1rem;
    }
    .alert {
        background-color: #ff000066;
        padding: 1rem;
    }
</style>
