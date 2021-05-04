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

    let name;

    const fetchUser = () => api.fetchUser(params.id);
    const getAvatar = name => api.getAvatar(name);
    const fetchTeams = () => api.fetchUserTeams().then(r => r.teams);
    const createTeam = name => api.createTeam(name);
    const deleteTeam = id => api.deleteTeam(id);
    const fetchPosts = () =>
        api.fetchUserPosts(params.id).then(r => r.documents);
    let all = Promise.all([fetchUser(), fetchPosts(), fetchTeams()]);
</script>

<section>
    {#await all}
        <Loading />
    {:then [author, posts, teams]}
        <section class="author">
            <Avatar src={getAvatar(author.name)} />
            <h3>{author.name}</h3>
        </section>
        {#if $state.user.$id == params.id}
            <h1>My Posts</h1>
            <p><a class="button" href="/create" use:link>Create</a></p>
            <section class="my-post">
                {#each posts as post}
                    <MyPost
                        on:deleted={() => {
                            all = Promise.all([
                                fetchUser(),
                                fetchPosts(),
                                teams,
                            ]);
                            console.log("deleted");
                        }}
                        {post} />
                {/each}
            </section>

            <section>
                <h1>My Teams</h1>
                <ul>
                    {#each teams as team}
                        <li>
                            <a href={`/teams/${team.$id}`} use:link
                                >{team.name}</a>
                            <span
                                on:click={async () => {
                                    await deleteTeam(team["$id"]);
                                    all = Promise.all([
                                        author,
                                        posts,
                                        fetchTeams(),
                                    ]);
                                    console.log("Deleted team", team["$id"]);
                                }}>❌</span>
                        </li>
                    {/each}
                </ul>
            </section>

            <section>
                <h1>Create Team</h1>
                <div>
                    <label for="team" />
                    <input
                        type="text"
                        name="team"
                        placeholder="Enter Team Name"
                        bind:value={name} />
                    <button
                        on:click={async () => {
                            await createTeam(name);
                            all = Promise.all([author, posts, fetchTeams()]);
                            console.log("team created");
                        }}>Create Team</button>
                </div>
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
