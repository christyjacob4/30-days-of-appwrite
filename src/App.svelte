<script>
  import Router from "svelte-spa-router";

  import Navigation from "./lib/Navigation.svelte";
  import Create from "./routes/Create.svelte";
  import Index from "./routes/Index.svelte";
  import Login from "./routes/Login.svelte";
  import NotFound from "./routes/NotFound.svelte";
  import Post from "./routes/Post.svelte";
  import Profile from "./routes/Profile.svelte";
  import Register from "./routes/Register.svelte";

  const routes = {
    "/": Index,
    "/create": Create,
    "/login": Login,
    "/register": Register,
    "/profile/:id?": Profile,
    "/post/:slug": Post,

    "*": NotFound,
  };
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
