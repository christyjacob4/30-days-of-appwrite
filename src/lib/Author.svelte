<script>
    import { api } from "../appwrite";

    import Avatar from "./Avatar.svelte";
    import Loading from "./Loading.svelte";

    export let user;
    const getAvatar = name => api.getAvatar(name);
    const fetchUser = api.fetchUser(user);
</script>

<a class="author" href={`#/profile/${user}`}>
    {#await fetchUser}
        <Loading />
    {:then author}
        <Avatar src={getAvatar(author.name)} />
        <h3>{author.name}</h3>
    {/await}
</a>

<style>
    a.author {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
</style>
