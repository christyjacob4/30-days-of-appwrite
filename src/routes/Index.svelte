<script>
    import md from "snarkdown";
    import Loading from "../lib/Loading.svelte";
    import Action from "../lib/Action.svelte";
    import Author from "../lib/Author.svelte";
    import Preview from "../lib/Preview.svelte";
    import { api } from "../appwrite";

    const data = api
        .fetchPosts(25, 0)
        .then(r => r.documents)
        .then(posts => {
            return {
                promoted: posts[0],
                featured: posts.slice(1, 5),
                latest: posts.slice(5),
            };
        });
</script>

{#await data}
    <Loading />
{:then { promoted, featured, latest }}
    <section class="top">
        <div class="promoted">
            {#if promoted.cover}
                <img src={api.getThumbnail(promoted.cover)} alt="" />
            {/if}
            <h2>{promoted.title}</h2>
            <Author user={promoted.user_id} />
            <p>
                {@html md(promoted.text)}
            </p>
            <Action href={`#/post/${promoted.$id}`}>Read more</Action>
        </div>
        <div class="cards">
            {#each featured as feature}
                <a class="card" href={`#/post/${feature.$id}`}>
                    {#if feature.cover}
                        <img
                            src={api.getThumbnail(feature.cover, 600, 400)}
                            alt="" />
                    {/if}
                    <h2>{feature.title}</h2>
                </a>
            {/each}
        </div>
    </section>
    <h1>Latest</h1>
    <section class="latest">
        {#each latest as post}
            <Preview {post} />
        {/each}
    </section>
{/await}

<style>
    section.top {
        display: flex;
        justify-content: space-evenly;
        gap: 16px;
        margin: 2em 0;
    }

    section.latest {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: space-between;
        align-items: auto;
        align-content: start;
        gap: 16px;
        margin-bottom: 2em;
    }

    img {
        width: 100%;
    }

    .promoted {
        padding: 16px;
        border: 1px solid #eee;
        border-radius: 8px;
        background-color: white;
    }

    .promoted img {
        border-radius: 8px;
    }

    .cards {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .cards .card {
        font-size: 0.75rem;
        display: flex;
        border-radius: 8px;
        gap: 16px;
        background-color: white;
        transition: all 0.2s;
        padding: 16px;
        border: 1px solid #eee;
        border-radius: 8px;
    }

    .cards .card:hover {
        background-color: #f02e65;
        color: white;
        transform: scale(1.02);
    }

    .card img {
        width: 45%;
        height: 100%;
        border-radius: 8px;
        object-fit: cover;
    }
</style>
