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

    img {
        width: 100%;
    }

    .promoted img {
        border-radius: 0.5rem;
    }

    .cards {
        display: flex;
        flex-direction: column;
        gap: 3rem;
    }

    .cards .card {
        font-size: 0.75rem;
        display: flex;
        border-radius: 0.5rem;
        align-items: center;
        gap: 0.5rem;
        background-color: white;
        transition: all 0.2s;
    }

    .cards .card:hover {
        background-color: #f02e65;
        color: white;
        transform: scale(1.05);
    }

    .card img {
        width: 50%;
        height: 100%;
        border-radius: 0.5rem;
        object-fit: cover;
    }
</style>
