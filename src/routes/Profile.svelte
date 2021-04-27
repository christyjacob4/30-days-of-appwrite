<script>
    import Preview from "../lib/Preview.svelte";

    import Avatar from "../lib/Avatar.svelte";

    import Loading from "../lib/Loading.svelte";

    export let params = {};

    const fetchUser = fetch(
        `https://jsonplaceholder.cypress.io/users/${params.id}`
    ).then(r => r.json());

    const fetchPosts = fetch(
        `https://jsonplaceholder.cypress.io/users/${params.id}/posts`
    ).then(r => r.json());
</script>

<section class="author">
    {#await fetchUser}
        <Loading />
    {:then author}
        <Avatar src={`https://i.pravatar.cc/100?img=${params.id}`} />
        <h3>{author.name}</h3>
    {/await}
</section>
<h1>Latest Posts</h1>
<section class="latest">
    {#await fetchPosts}
        <Loading />
    {:then posts}
        {#each posts as post}
            <Preview {...post} />
        {/each}
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
</style>
