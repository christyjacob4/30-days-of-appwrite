<script>
    import { api } from "../appwrite";

    let name,
        mail,
        pass = "";

    const submit = async () => {
        try {
            await api.register(name, mail, pass);
        } catch (error) {
            console.log(error.message);
        }
    };
</script>

<h1>Login</h1>
<form on:submit|preventDefault={submit}>
    <label for="mail"><b>Name</b></label>
    <input
        bind:value={name}
        type="text"
        placeholder="Enter Name"
        name="name"
        required />

    <label for="mail"><b>E-Mail</b></label>
    <input
        bind:value={mail}
        type="email"
        placeholder="Enter E-mail"
        name="mail"
        required />

    <label for="pass"><b>Password</b></label>
    <input
        bind:value={pass}
        type="password"
        placeholder="Enter Password"
        name="pass"
        required />

    <button type="submit">Register</button>
</form>

<style>
    form {
        display: flex;
        flex-direction: column;
    }
</style>
