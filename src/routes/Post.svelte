<script>
    import Loading from "../lib/Loading.svelte";
    import md from "snarkdown";
    import Author from "../lib/Author.svelte";
    import Comment from "../lib/Comment.svelte";
    import { api } from "../appwrite";

    export let params = {};

    let postFetch = api.fetchPost(params.slug);
    let commentsFetch = fetch(
        `https://jsonplaceholder.cypress.io/posts/${params.slug}/comments`
    ).then(r => r.json());
</script>

{#await postFetch}
    <Loading />
{:then post}
    <h1>
        {post.title}
    </h1>
    <Author user={post.user_id} />
    {#if post.cover}
        <img class="cover" src={api.getThumbnail(post.cover)} alt="" />
    {/if}
    <section class="content">
        {@html md(post.text)}
        <!-- TODO line breaks not parsing -->
    </section>
    <h2>Comments</h2>
    <section class="comments">
        {#await commentsFetch}
            <Loading />
        {:then comments}
            {#each comments as comment}
                <Comment {...comment} />
            {/each}
        {/await}
    </section>
{/await}

<style>
    img.cover {
        width: 100%;
        border-radius: 0.5rem;
    }

    section {
        font-size: 1.1rem;
        line-height: 2rem;
    }
</style>
