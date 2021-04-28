<script>
    import { api } from "../appwrite";
    export let post;
</script>

<a href={`#/post/${post.$id}`}>
    {#if post.cover}
        <img class="cover" src={api.getThumbnail(post.cover)} alt="" />
    {/if}
    <h2>{post.title}</h2>
</a>

<style>
    img.cover {
        width: 100%;
        border-radius: 0.5rem;
    }

    a {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        border-radius: 0.5rem;
        background-color: white;
        max-width: 18rem;
        font-size: 1.1rem;
        line-height: 2rem;
        transition: all 0.2s;
    }

    a:hover {
        background-color: #f02e65;
        color: white;
        transform: scale(1.05);
    }

    h2 {
        font-size: 1.1rem;
        margin: 0.5rem;
        text-align: center;
    }
</style>
