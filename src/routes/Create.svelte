<script>
    import EasyMDE from "easymde";
    import { api } from "../appwrite";
    import { state } from "../store";
    import { onMount } from "svelte";
    import "../../node_modules/easymde/dist/easymde.min.css";
    import Loading from "../lib/Loading.svelte";

    export let params = {};
    let postFetch = new Promise(() => {}).resolved;
    if (params.slug) {
        postFetch = api.fetchPost(params.slug);
    }
    let published = false,
        title = "",
        files,
        easyMDE,
        message = "",
        loading = false,
        content = "";
    onMount(() => {
        easyMDE = new EasyMDE({ element: document.getElementById("content") });
    });
    const submit = async () => {
        let cover = "";
        message = "";
        loading = true;

        if (files && files.length == 1) {
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
            await api.createPost(
                {
                    title: title,
                    text: content,
                    published: published,
                    user_id: $state.user.$id,
                    created_at: new Date().getTime(),
                    cover: cover,
                },
                $state.user.$id,
                $state.profile.$id
            );
            easyMDE.value("");
            title = "";
            content = "";
            files = [];
            console.log("post created successfully");
            message = "Post created successfully";
        } catch (error) {
            console.log(error);
            message = error;
        } finally {
            loading = false;
        }
    };
</script>

<section>
    <h2>Create Post</h2>
    {#if message}
        <div class="alert">{message}</div>
    {/if}
    {#await postFetch}
        <Loading />
    {:then post}
        <form on:submit|preventDefault={submit}>
            <label for="cover">Cover</label>
            <input type="file" bind:files />
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
            <button
                disabled={loading ? true : false}
                class="button"
                type="submit">Create</button>
        </form>
    {/await}
</section>

<style>
    form {
        display: flex;
        flex-direction: column;
    }
    label {
        margin-top: 1rem;
    }
    .alert {
        background-color: #ff000066;
        padding: 1rem;
    }
</style>
