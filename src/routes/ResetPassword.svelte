<script>
    import { api } from "../appwrite";

    let urlSearchParams = new URLSearchParams(window.location.search);
    let secret = urlSearchParams.get("secret");
    let userId = urlSearchParams.get("userId");

    let password = "",
        confirmPassword = "";

    const submit = async () => {
        try {
            await api.completePasswordRecovery(
                userId,
                secret,
                password,
                confirmPassword
            );
            window.location.href = "/#/login";
        } catch (error) {
            alert(error.message);
        }
    };
</script>

<div class="flexbox">
    <h1>Reset your password</h1>

    <form on:submit|preventDefault={submit}>
        <label for="password"><b>New Password</b></label>
        <input
            bind:value={password}
            type="password"
            placeholder="Enter New Password"
            name="password"
            required />

        <label for="confirmPassword"><b>Confirm Password</b></label>
        <input
            bind:value={confirmPassword}
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            required />

        <button class="button" type="submit">Reset Password</button>
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
