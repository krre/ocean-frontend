<script>
    import { stores } from "@sapper/app";
    import { onMount } from "svelte";
    import { Request } from "../js/json-rpc.js";
    import { sendRequest } from "net.js";
    import { formatDateTime } from "utils.js";

    const { session } = stores();

    let topics = [];
    let selected = [];

    onMount(async () => {
        console.log("session", $session.user);
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

{#if topics.length && $session.user}
    <button on:click={deleteTopic}>Удалить</button>
{/if}

{#each topics as topic}
    <p>
        {#if $session.user}
            <input type="checkbox" bind:group={selected} value={topic.id} />
        {/if}
        <a href="topic/{topic.id}">
            {formatDateTime(topic.create_ts)} | {topic.title}
        </a>
    </p>
{/each}
