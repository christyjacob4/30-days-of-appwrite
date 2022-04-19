<script>
    import { link } from "svelte-spa-router";
    import Loading from "../lib/Loading.svelte";
    import { api } from "../appwrite";
    import { state } from "../store";

    export let params = {};

    let name = "",
        email = "";

    const fetchTeam = () => api.getTeam(params.id);
    const fetchMemberships = () =>
        api.getMemberships(params.id).then(r => r.memberships);
    const createMembership = (email, name) =>
        api.createMembership(
            params.id,
            email,
            ["member"],
            `${window.origin}/#/acceptMembership`,
            name
        );
    const deleteMembership = async (teamId, membershipId) => {
        try {
            await api.deleteMembership(teamId, membershipId);
            all = Promise.all([fetchTeam(), fetchMemberships()]);
        } catch (error) {
            alert(error.message);
        }
    };

    let all = Promise.all([fetchTeam(), fetchMemberships()]);
</script>

<section>
    {#await all}
        <Loading />
    {:then [team, memberships]}
        <section>
            <div class="header">
                <h1>{team.name}</h1>
                <button
                    on:click={async () => {
                        api.deleteTeam(params.id).then(() => {
                            window.history.go(-1);
                        });
                    }}>❌ Delete Team</button>
            </div>
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
                        all = Promise.all([fetchTeam(), fetchMemberships()]);
                        console.log("membership created");
                    }}>➕ Add Member</button>
            </div>
            <h3>Members</h3>
            <ul>
                {#each memberships as member}
                    <li>
                        <div>
                            <div>
                                <p>Name : {member.name}</p>
                                {#if member.userId != $state.user.$id}
                                <button on:click={() => deleteMembership(params.id, member.$id)}
                                    >❌ Delete Member</button>
                                    {/if}
                            </div>

                            <p>Email: {member.email}</p>
                            <p>
                                Invited on : {new Date(member.invited * 1000)}
                            </p>
                            <p>Joined on : {new Date(member.joined * 1000)}</p>
                            <p>Confirmed : {member.confirm}</p>
                            <p>Roles : {member.roles}</p>
                        </div>
                    </li>
                {/each}
            </ul>
        </section>
    {:catch error}
        {error}
        <p>
            Team not found
            <a href="/" use:link>Go Home</a>
        </p>
    {/await}
</section>

<style>
    .header {
        display: flex;
        align-items: center;
    }

    .header > button {
        height: min-content;
    }
</style>
