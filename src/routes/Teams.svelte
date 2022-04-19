<script>
    import { link } from "svelte-spa-router";
    import Avatar from "../lib/Avatar.svelte";
    import Loading from "../lib/Loading.svelte";
    import { api } from "../appwrite";

    export let params = {};

    let name;

    const fetchUser = () => api.fetchUser(params.id);
    const getAvatar = name => api.getAvatar(name);
    const fetchTeams = () => api.fetchUserTeams().then(r => r.teams);
    const createTeam = name => api.createTeam(name);
    const deleteTeam = id => api.deleteTeam(id);
    let all = Promise.all([fetchUser(), fetchTeams()]);
</script>

<section>
    {#await all}
        <Loading />
    {:then [author, teams]}
        <section class="author">
            <Avatar src={getAvatar(author.name)} />
            <h3>{author.name}</h3>
        </section>
        <section>
            <h1>My Teams</h1>
            <ul>
                {#each teams as team}
                    <li>
                        <a href={`/team/${team.$id}`} use:link>{team.name}</a>
                        <button
                            on:click={async () => {
                                await deleteTeam(team["$id"]);
                                all = Promise.all([
                                    author,
                                    fetchTeams(),
                                ]);
                                console.log("Deleted team", team["$id"]);
                            }}>❌</button>
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
                        all = Promise.all([author, fetchTeams()]);
                        console.log("team created");
                    }}>Create Team</button>
            </div>
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
 
</style>
