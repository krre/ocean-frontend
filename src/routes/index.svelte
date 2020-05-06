<script>
    import * as sapper from "@sapper/app";
    import { onMount } from "svelte";
    import { Request } from "../js/json-rpc.js";
    import { sendRequest } from "../js/net.js";
    import { formatDateTime } from "../js/utils.js";

    let topics = [];
    let selected = [];

    onMount(async () => {
        topics = await sendRequest(new Request("topic.get"));
    });

    async function deleteTopic() {
        if (selected.length) {
            await sendRequest(new Request("topic.delete", { id: selected }));
            topics = topics.filter(function(topic) {
                return selected.indexOf(topic.id) === -1;
            });
            selected = [];
        }
    }
</script>

<style>

</style>

<svelte:head>
    <title>Океан. Каталог фактов эффекта Манделы</title>
</svelte:head>

<h1>Каталог</h1>

{#if topics.length}
    <button on:click={deleteTopic}>Удалить</button>
{/if}

{#each topics as topic}
    <p>
        <input type="checkbox" bind:group={selected} value={topic.id} />
        <a href="topic/{topic.id}">
            {formatDateTime(topic.create_ts)} | {topic.title}
        </a>
    </p>
{/each}
