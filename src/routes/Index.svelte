<script>

</script>

<section>
    Hello world
</section>

<style>
    section.top {
        display: flex;
        justify-content: space-evenly;
        gap: 1rem;
    }

    section.latest {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: center;
        align-items: auto;
        align-content: start;
        gap: 1rem;
    }

    img {
        width: 100%;
    }

    .promoted img {
        border-radius: 0.5rem;
    }

    .cards {
        display: flex;
        flex-direction: column;
        gap: 3rem;
    }

    .cards .card {
        font-size: 0.75rem;
        display: flex;
        border-radius: 0.5rem;
        align-items: center;
        gap: 0.5rem;
        background-color: white;
        transition: all 0.2s;
    }

    .cards .card:hover {
        background-color: #f02e65;
        color: white;
        transform: scale(1.05);
    }

    .card img {
        width: 50%;
        height: 100%;
        border-radius: 0.5rem;
        object-fit: cover;
    }
</style>
