<script>
    import { state } from "../store";
    import { link } from "svelte-spa-router";
</script>

<nav>
    <a href="/" class="logo" use:link>Logo</a>
    {#if $state.user}
        <a href={`/profile/${$state.user.$id}`} use:link>{$state.user.name}</a>
        <a href={`/profile/${$state.user.$id}/teams`} use:link>My Teams</a>
        <a href="/logout" use:link>Logout</a>
    {:else}
        <a href="/login" use:link>Login</a>
        <a href="/register" use:link>Register</a>
    {/if}
</nav>

<style>
    nav {
        grid-area: navigation;
        display: flex;
        align-items: center;
        position: sticky;
        top: 0;
        background-color: #fafafa;
        border-bottom: 1px solid #eee;
    }

    a {
        margin: 0 1rem;
    }

    .logo {
        font-size: 1.2rem;
        margin-right: auto;
        color: #f02e65;
    }
</style>
