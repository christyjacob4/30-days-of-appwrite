<script>
    import { api } from "../appwrite";

    let urlSearchParams = new URLSearchParams(window.location.search);
    let inviteId = urlSearchParams.get("inviteId");
    let secret = urlSearchParams.get("secret");
    let teamId = urlSearchParams.get("teamId");
    let userId = urlSearchParams.get("userId");

    api.updateMembership(teamId, inviteId, userId, secret).then(() => {
        window.location = "/"
    });
</script>