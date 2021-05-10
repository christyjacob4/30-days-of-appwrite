<script>
    import { api } from "../appwrite";

    let urlSearchParams = new URLSearchParams(window.location.search);
    let secret = urlSearchParams.get("secret");
    let userId = urlSearchParams.get("userId");

    console.log(userId,secret);

    const completeEmailVerification = async () => {
        await api.completeEmailVerification(userId, secret)
        window.location.href = "/"
    }
    completeEmailVerification()
</script>