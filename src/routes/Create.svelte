<script>
    import EasyMDE from "easymde";
    import { onMount } from "svelte";
    import "../../node_modules/easymde/dist/easymde.min.css";

    onMount(() => {
        let easyMDE = new EasyMDE({element: document.getElementById('content')});
    });
</script>

<section>
    <h2>Create Post</h2>
    <form>
        <textarea
            name="content"
            id="content"
            cols="30"
            rows="10"
            placeholder="Enter content" />
    </form>
</section>
