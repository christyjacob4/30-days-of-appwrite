<script>
  import Loading from "../lib/Loading.svelte";
  import { api } from "../appwrite";
</script>

{#await api.logout()}
  <Loading />
{:then log}
  <h1>Successfully logged out!</h1>
{/await}
