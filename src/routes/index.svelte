<script>
    import { onMount } from "svelte";
    import { Request } from "../js/json-rpc.js";
    import { sendRequest } from "../js/net.js";
    let topics = [];

    onMount(async () => {
        topics = await sendRequest(new Request("topic.get"));
        console.log(topics);
    });

    function formatDate(date) {
        const d = new Date(date);
        return (
            ("0" + d.getDay()).slice(-2) +
            "." +
            ("0" + d.getMonth()).slice(-2) +
            "." +
            d.getFullYear() +
            " " +
            ("0" + d.getHours()).slice(-2) +
            ":" +
            ("0" + d.getMinutes()).slice(-2)
        );
    }
</script>

<style>

</style>

<svelte:head>
    <title>Океан. Каталог фактов эффекта Манделы</title>
</svelte:head>

<h1>Каталог</h1>
{#each topics as topic}
    <p>{formatDate(topic.create_ts)} | {topic.title}</p>
{/each}
