<script>
    import { onMount } from "svelte";
    import { Request } from "../js/json-rpc.js";
    import { sendRequest } from "../js/net.js";
    import { formatDateTime } from "../js/utils.js";
    let topics = [];

    onMount(async () => {
        topics = await sendRequest(new Request("topic.get"));
    });
</script>

<style>

</style>

<svelte:head>
    <title>Океан. Каталог фактов эффекта Манделы</title>
</svelte:head>

<h1>Каталог</h1>
{#each topics as topic}
    <p>
        <a href="topic/{topic.id}">
            {formatDateTime(topic.create_ts)} | {topic.title}
        </a>
    </p>
{/each}
