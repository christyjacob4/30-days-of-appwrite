<script>
    import { link } from "svelte-spa-router";
    import Preview from "../lib/Preview.svelte";

    import Avatar from "../lib/Avatar.svelte";

    import Loading from "../lib/Loading.svelte";

    import { api } from "../appwrite";

    export let params = {};

    const fetchUser = api.fetchUser(params.id);
    const getAvatar = name => api.getAvatar(name);
    const fetchPosts = fetch(
        `https://jsonplaceholder.cypress.io/users/${params.id}/posts`
    ).then(r => r.json());
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
        <a class="button" href="/create" use:link>Create</a>
        <section class="latest">
            {#each posts as post}
                <Preview {...post} />
            {/each}
        </section>
    {:catch error}
        <p>
            Public profile not found
            <a classname="button" href="/profile/create" use:link>Create Public Profile</a>
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
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: center;
        align-items: auto;
        align-content: start;
        gap: 1rem;
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
    a.button {
        margin-top: 20px;
        background-color: #f02e65;
        border: none;
        padding: 10px;
        color: white;
        font-weight: bold;
    }
    a.button:hover {
        background-color: #f02e65aa;
    }
</style>
