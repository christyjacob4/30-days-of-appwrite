<script>
    import { link } from "svelte-spa-router";
    import { api } from "../appwrite";
    export let post;
</script>

<article class="card">
    {#if post.cover}
        <img class="cover" src={api.getThumbnail(post.cover)} alt="" />
    {/if}
    <h2>{post.title}</h2>
    <a href="/post/{post.$id}" use:link class="button">Preview</a>
    <a href="/edit" class="button">Edit</a>
    <a href="/delete" class="button">Delete</a>
</article>

<style>
    article.card {
        background-color: white;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        border-radius: 0.5rem;
    }

    img.cover {
        width: 8rem;
        border-top-left-radius: 0.5rem;
        border-bottom-left-radius: 0.5rem;
    }

    h2 {
        font-size: 1.1rem;
        margin: 0.5rem;
        text-align: center;
    }
</style>
