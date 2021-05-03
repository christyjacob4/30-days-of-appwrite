<script>
    import { onMount } from "svelte";
    import { link } from "svelte-spa-router";
    import Avatar from "../lib/Avatar.svelte";
    import Loading from "../lib/Loading.svelte";
    import { api } from "../appwrite";
    import { state } from "../store";

    export let params = {};

    let name = "",
        email = "";

    const getAvatar = name => api.getAvatar(name);
    const fetchUser = () => api.fetchUser(params.id);
    const fetchTeam = () => api.getTeam(params.teamId);
    const fetchMemberships = () =>
        api.getMemberships(params.teamId).then(r => r.memberships);
    const createMembership = (email, name) =>
        api.createMembership(
            params.teamId,
            email,
            ["guest"],
            "http://localhost:3000/#/acceptTeamInvite",
            name
        );
    let all = Promise.all([fetchUser(), fetchTeam(), fetchMemberships()]);
</script>

<section>
    {#await all}
        <Loading />
    {:then [author, team, memberships]}
        <section class="author">
            <Avatar src={getAvatar(author.name)} />
            <h3>{author.name}</h3>
        </section>

        <section>
            <h1>{team.name}</h1>
            <div>
                <label for="email" />
                <input
                    type="text"
                    name="email"
                    placeholder="Enter Email Address"
                    bind:value={email} />
                <label for="name" />
                <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    bind:value={name} />
                <button
                    on:click={async () => {
                        await createMembership(email, name);
                        all = Promise.all([
                            fetchUser(),
                            fetchTeam(),
                            fetchMemberships(),
                        ]);
                        console.log("membership created");
                    }}>➕ Add Member</button>
            </div>
            <h3>Members</h3>
            <ul>
                {#each memberships as member}
                    <li>
                        <div>
                            <p>Name : {member.name}</p> 
                            <p>Email: {member.email}</p> 
                            <p>Invited on : {new Date(member.invited*1000)}</p> 
                            <p>Joined on : {new Date(member.joined*1000)}</p> 
                            <p>Confirmed : {member.confirm}</p> 
                            <p>Roles : {member.roles}</p>
                        </div>
                    </li>
                {/each}
            </ul>
        </section>

        <!-- <section>
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
                        all = Promise.all([fetchUser(), fetchTeams()]);
                        console.log("team created");
                    }}>Create Team</button>
            </div>
        </section> -->
    {:catch error}
        {error}
        <p>
            Public profile not found
            <a href="/profile/create" use:link>Create Public Profile</a>
        </p>
    {/await}
</section>

<style>
</style>
