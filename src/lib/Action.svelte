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
        padding: 0.75rem 1.5rem;
        background-color: green;
        color: white !important;
        border-radius: 0.5rem;
    }
</style>
