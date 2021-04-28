<script>
    import { onMount } from "svelte";
    import { link } from "svelte-spa-router";
    import Preview from "../lib/Preview.svelte";
    import MyPost from "../lib/MyPost.svelte";

    import Avatar from "../lib/Avatar.svelte";

    import Loading from "../lib/Loading.svelte";

    import { api } from "../appwrite";
    import { state } from "../store";

    export let params = {};

    const fetchUser = id => api.fetchUser(id);
    const getAvatar = name => api.getAvatar(name);
    const fetchPosts = id => api.fetchUserPosts(id).then(r => r.documents);
    let all = id => Promise.all([fetchUser(id), fetchPosts(id)]);
</script>

<section>
    {#await all(params.id)}
        <Loading />
    {:then [author, posts]}
        <section class="author">
            <Avatar src={getAvatar(author.name)} />
            <h3>{author.name}</h3>
        </section>
        {#if $state.user.$id == params.id}
            <h1>My Posts</h1>
            <p><a class="button" href="/create" use:link>Create</a></p>
            <section class="my-post">
                {#each posts as post}
                    <MyPost {post} />
                {/each}
            </section>
        {:else}
            <h1>Latest Posts</h1>
            <section class="latest">
                {#each posts as post}
                    <Preview {post} />
                {/each}
            </section>
        {/if}
    {:catch error}
        {error}
        <p>
            Public profile not found
            <a href="/profile/create" use:link>Create Public Profile</a>
        </p>
    {/await}
</section>

<style>
    section.author {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    section.latest {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-items: auto;
        align-content: start;
        gap: 1rem;
    }
    section.my-post {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: auto;
        align-content: start;
        gap: 0.5rem;
    }
    a {
        border: none;
        padding: 10px;
        color: white;
        font-weight: bold;
    }
    a:hover {
        text-decoration: underline;
    }
</style>
