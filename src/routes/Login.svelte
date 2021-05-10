<script>
    import { api } from "../appwrite";
    import { replace } from "svelte-spa-router";

    let mail,
        pass = "";

    const submit = async () => {
        try {
            await api.login(mail, pass);
            replace("/");
        } catch (error) {
            console.log(error.message);
        }
    };

    const loginWithGoogle = async () => {
        try {
            await api.loginWithGoogle();
        } catch (error) {
            console.log(error.message);
        }
    };

    const forgotPassword = async () => {
        const url = `${window.location.origin}/#/resetPassword`
        console.log(url);
        try {
            await api.forgotPassword(mail, url)
            alert("Recovery Email Sent")
        } catch (error) {
            alert(error.message);
        }
    }

</script>

<div>
    <h1>Login</h1>
    <form on:submit|preventDefault={submit}>
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

        <button class="button" type="submit">Login</button>
        <button class="button" on:click|preventDefault={loginWithGoogle}
            >Login With Google</button>
        <button class="button" on:click|preventDefault={forgotPassword}
            >Forgot Password?</button>
    </form>
</div>

<style>
    div {
        margin-left: auto;
        margin-right: auto;
        width: 400px;
    }
    form {
        display: flex;
        flex-direction: column;
    }
</style>
