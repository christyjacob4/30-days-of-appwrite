<script>
    import { state } from "../store";
    import { link } from "svelte-spa-router";
    import { api } from "../appwrite";

    const startEmailVerification = async () => {
        try {
            const url = `${window.location.origin}/#/verifyEmail`
            await api.createVerification(url)
            alert("Verification Email sent")
        } catch (error) {
            alert(error.message)
        }
    }
</script>

<nav>
    <a href="/" class="logo" use:link>Logo</a>
    {#if $state.user}
        <a href={`/profile/${$state.user.$id}`} use:link>{$state.user.name}</a>
        {#if !$state.user.emailVerification}
            <button on:click={startEmailVerification}>Not Verified ❌</button>
        {:else}
            <p>Verified ✅</p>
        {/if}
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
