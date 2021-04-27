<script>
    import { state } from "../store";
    import { api } from "../appwrite";
    import { replace } from "svelte-spa-router";
    let name = $state.user.name;
    const submit = async () => {
        try {
            //create
            await api.createUser($state.user.$id, name);
            replace(`/profile/${$state.user.$id}`);
        } catch (error) {
            console.log(error.message);
        }
    };
</script>

<form on:submit|preventDefault={submit}>
    {#if $state.user}
        <label for="name">Diaplay Name</label>
        <input type="text" name="name" bind:value={name} />
        <button type="submit">Create</button>
    {/if}
</form>

<style>
    form {
        margin: auto;
        width: 500;
        display: flex;
        flex-direction: column;
    }
</style>
