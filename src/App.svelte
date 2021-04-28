<script>
    import { onMount } from "svelte";

    import Router from "svelte-spa-router";
    import { api } from "./appwrite";

    import Navigation from "./lib/Navigation.svelte";
    import Create from "./routes/Create.svelte";
    import CreateProfile from "./routes/CreateProfile.svelte";
    import Index from "./routes/Index.svelte";
    import Login from "./routes/Login.svelte";
    import Logout from "./routes/Logout.svelte";
    import NotFound from "./routes/NotFound.svelte";
    import Post from "./routes/Post.svelte";
    import Profile from "./routes/Profile.svelte";
    import Register from "./routes/Register.svelte";
    import { state } from "./store";

    const routes = {
        "/": Index,
        "/create": Create,
        "/login": Login,
        "/logout": Logout,
        "/register": Register,
        "/profile/create": CreateProfile,
        "/profile/:id": Profile,
        "/post/:slug": Post,

        "*": NotFound,
    };

    onMount(async () => {
        try {
            const user = await api.getAccount();
            state.update(n => {
                n.user = user;
                return n;
            });
        } catch (error) {
            state.update(n => {
                n.user = n.user;
                return n;
            });
        }
        try {
            const profile = await api.fetchUser($state.user.$id);
            state.update(n => {
                n.profile = profile;
                return n;
            });
        } catch (error) {
            state.update(n => {
                n.profile = null;
                return n;
            });
        }
    });
</script>

<main>
    <Navigation />
    <div class="content">
        <Router {routes} />
    </div>
</main>

<style>
    :root {
        font-family: "Poppins", sans-serif;
        background-color: rgb(228, 228, 228);
    }

    :global(a) {
        color: inherit;
        text-decoration: none;
    }
    :global(a):visited {
        color: inherit;
        text-decoration: none;
    }

    main {
        display: grid;
        max-width: 960px;
        margin: auto;
        grid-template-columns: 1fr;
        grid-template-rows: 4em 1fr;
        grid-template-areas:
            "navigation"
            "content";
    }

    .content {
        grid-area: content;
        display: flex;
        flex-direction: column;
    }
</style>
