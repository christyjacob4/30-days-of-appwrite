<script>
  import { link } from "svelte-spa-router";
</script>

<nav>
  <a href="/" class="logo" use:link>Logo</a>
  <a href="/login" use:link>Login</a>
  <a href="/register" use:link>Register</a>
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
