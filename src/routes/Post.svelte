<script>
    import Loading from "../lib/Loading.svelte";
    import md from "snarkdown";
    import Author from "../lib/Author.svelte";
    import Comment from "../lib/Comment.svelte";
    import { api } from "../appwrite";

    export let params = {};

    let postFetch = api.fetchPost(params.slug);
    let commentsFetch = fetch(
        `https://jsonplaceholder.cypress.io/posts/${params.slug}/comments`
    ).then(r => r.json());
    let qrCode = null;

    var pageLink = window.location.href;
    var pageTitle = String(document.title).replace(/\&/g, "%26");

    const fbs_click = () => {
        window.open(
            `http://www.facebook.com/sharer.php?u=${pageLink}&quote=${pageTitle}`,
            "sharer",
            "toolbar=0,status=0,width=626,height=436"
        );
        return false;
    }

    const tbs_click = () => {
        window.open(
            `https://twitter.com/intent/tweet?text=${pageTitle}&url=${pageLink}`,
            "sharer",
            "toolbar=0,status=0,width=626,height=436"
        );
        return false;
    }

    const lbs_click = () => {
        window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${pageLink}`,
            "sharer",
            "toolbar=0,status=0,width=626,height=436"
        );
        return false;
    }

    const rbs_click = () => {
        window.open(
            `https://www.reddit.com/submit?url=${pageLink}`,
            "sharer",
            "toolbar=0,status=0,width=626,height=436"
        );
        return false;
    }

    const pbs_click = () => {
        window.open(
            `https://www.pinterest.com/pin/create/button/?&text=${pageTitle}&url=${pageLink}&description=${pageTitle}`,
            "sharer",
            "toolbar=0,status=0,width=626,height=436"
        );
        return false;
    }

    let qrcode_click = async () => {
        qrCode = await api.getQRcode(pageLink);
    };
</script>

{#await postFetch}
    <Loading />
{:then post}
    <h1>
        {post.title}
    </h1>
    <Author user={post.user_id} />
    {#if post.cover}
        <img class="cover" src={api.getThumbnail(post.cover)} alt="" />
    {/if}
    <section class="content">
        {@html md(post.text)}
        <!-- TODO line breaks not parsing -->
    </section>
    <h2>Comments</h2>
    <section class="comments">
        {#await commentsFetch}
            <Loading />
        {:then comments}
            {#each comments as comment}
                <Comment {...comment} />
            {/each}
        {/await}
    </section>

    <!-- Share -->
    <section>
        <div class="share-buttons-container">
            <div class="share-list">
                <!-- FACEBOOK -->
                <a class="fb-h" on:click={fbs_click} target="_blank">
                    <img
                        src="https://img.icons8.com/material-rounded/96/000000/facebook-f.png" />
                </a>

                <!-- TWITTER -->
                <a class="tw-h" on:click={tbs_click} target="_blank">
                    <img
                        src="https://img.icons8.com/material-rounded/96/000000/twitter-squared.png" />
                </a>

                <!-- LINKEDIN -->
                <a class="li-h" on:click={lbs_click} target="_blank">
                    <img
                        src="https://img.icons8.com/material-rounded/96/000000/linkedin.png" />
                </a>

                <!-- REDDIT -->
                <a class="re-h" on:click={rbs_click} target="_blank">
                    <img
                        src="https://img.icons8.com/ios-glyphs/90/000000/reddit.png" />
                </a>

                <!-- PINTEREST -->
                <a
                    data-pin-do="buttonPin"
                    data-pin-config="none"
                    class="pi-h"
                    on:click={pbs_click}
                    target="_blank">
                    <img
                        src="https://img.icons8.com/ios-glyphs/90/000000/pinterest.png" />
                </a>

                <!-- QR Code -->
                <a class="pi-h" on:click={qrcode_click} target="_blank">
                    <img src="https://img.icons8.com/ios-glyphs/60/000000/qr-code--v1.png"/>
                </a>
            </div>
        </div>
        {#if qrCode}
            <img src={qrCode} alt="No QR Code">
        {/if}
        
    </section>
{/await}

<style>
    img.cover {
        width: 100%;
        border-radius: 0.5rem;
    }

    section {
        font-size: 1.1rem;
        line-height: 2rem;
    }

    .share-list {
        display: flex;
        flex-direction: row;
    }

    .share-list a {
        border-radius: 100px;
        width: 50px;
        height: 50px;
        padding: 7px;
        margin: 10px;
        cursor: pointer;
        overflow: hidden;
    }
    .share-list a img {
        width: 100%;
        height: 100%;
        filter: invert(100%);
    }

    a.fb-h {
        background: #3b5998;
    }

    a.tw-h {
        background: #00acee;
    }

    a.li-h {
        background: #0077b5;
    }

    a.re-h {
        background: #ff5700;
    }

    a.pi-h {
        background: #c8232c;
    }

    * {
        margin: 0;
        pading: 0;
        box-sizing: border-box;
    }

    .share-buttons-container {
        display: flex;
        justify-content: start;
        align-items: center;
        width: 100%;
        height: min-content;
    }
</style>
