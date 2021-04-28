<script>
    import EasyMDE from "easymde";
    import { api } from "../appwrite";
    import { state } from "../store";
    import { onMount } from "svelte";
    import "../../node_modules/easymde/dist/easymde.min.css";

    let published = false,
        title = "",
        easyMDE,
        content = "";
    onMount(() => {
        easyMDE = new EasyMDE({ element: document.getElementById("content") });
    });
    const submit = async () => {
        let content = easyMDE.value();
        if (title.trim() == "" || content.trim() == "") {
            console.log("title and content are both required");
        }
        console.log({
            title: title,
            text: content,
            published: published,
            user: $state.user.$id,
            profile: $state.profile.$id,
        });
        try {
            await api.createPost(
                {
                    title: title,
                    text: content,
                    published: published,
                },
                $state.user.$id,
                $state.profile.$id
            );
            console.log("post created successfully");
        } catch (error) {
            console.log(error);
        }
    };
</script>

<section>
    <h2>Create Post</h2>
    <form on:submit|preventDefault={submit}>
        <label for="title">Title</label>
        <input type="text" placeholder="Enter title" bind:value={title} />
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
        <button type="submit">Create</button>
    </form>
</section>

<style>
    form {
        display: flex;
        flex-direction: column;
    }
    label {
        margin-top: 1rem;
    }
</style>
