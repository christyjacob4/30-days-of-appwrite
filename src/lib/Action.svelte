<script>
    export let href;
</script>
<a {href}>
  <slot />
</a>

<style>
  a {

    display: inline-block;
    cursor: pointer;
    padding: .75rem 1.5rem;
    background-color: green;
    color: white;
    border-radius: .5rem;

  }
</style>
