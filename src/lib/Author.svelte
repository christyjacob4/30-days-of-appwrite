<script>
  import Avatar from "./Avatar.svelte";
  import Loading from "./Loading.svelte";

  export let user;

  const fetchUser = fetch(
    `https://jsonplaceholder.cypress.io/users/${user}`
  ).then((r) => r.json());
</script>

<div class="author">
  {#await fetchUser}
    <Loading />
  {:then author}
    <Avatar src={`https://i.pravatar.cc/100?img=${user}`} />
    <h3>{author.name}</h3>
  {/await}
</div>

<style>
  div.author {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
</style>
