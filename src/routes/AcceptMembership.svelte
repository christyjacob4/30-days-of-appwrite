<script>
    import { onMount } from "svelte";
    import {location, querystring} from 'svelte-spa-router'
    import { link } from "svelte-spa-router";
    import Preview from "../lib/Preview.svelte";
    import MyPost from "../lib/MyPost.svelte";

    import Avatar from "../lib/Avatar.svelte";

    import Loading from "../lib/Loading.svelte";

    import { api } from "../appwrite";
    import { state } from "../store";

    export let params = {};

    let name = "";

    const fetchUser = () => api.fetchUser(params.id);
    const getAvatar = name => api.getAvatar(name);
    const fetchTeams = () => api.fetchUserTeams().then(r => r.teams);
    const createTeam = name => api.createTeam(name);
    const deleteTeam = id => api.deleteTeam(id);
    let all = Promise.all([fetchUser(), fetchTeams()]);
</script>

<section>
    <div>
        {$querystring}
    </div>  
</section>

<style>

</style>
