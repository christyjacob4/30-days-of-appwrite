<script>
	import '../app.css';

	import Header from '$lib/comps/Header.svelte';
	import Footer from '$lib/comps/Footer.svelte';
	import Register from '$lib/comps/Register.svelte';
	import Login from '$lib/comps/Login.svelte';
</script>

<Header />

<div style="border: 1px solid rgba(232, 233, 240, 0.49);">
	<slot />
</div>

<Footer />

<!-- MODALS -->
<Register />
<Login />
<!-- MODALS END -->
