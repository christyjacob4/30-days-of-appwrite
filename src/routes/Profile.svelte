<script>
    import { link } from "svelte-spa-router";
    import Preview from "../lib/Preview.svelte";

    import Avatar from "../lib/Avatar.svelte";

    import Loading from "../lib/Loading.svelte";

    import { api } from "../appwrite";

    export let params = {};

    const fetchUser = api.fetchUser(params.id);
    const getAvatar = name => api.getAvatar(name);
    const fetchPosts = api.fetchUserPosts(params.id).then(r => r.documents);
    const all = Promise.all([fetchUser, fetchPosts]);
</script>

<section>
    {#await all}
        <Loading />
    {:then [author, posts]}
        <section class="author">
            <Avatar src={getAvatar(author.name)} />
            <h3>{author.name}</h3>
        </section>
        <h1>Latest Posts</h1>
        <p><a class="button" href="/create" use:link>Create</a></p>
        <section class="latest">
            {#each posts as post}
                <Preview post={post} />
            {/each}
        </section>
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
        flex-direction: column;
        justify-content: flex-start;
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
