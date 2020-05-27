<script>
    import { stores } from "@sapper/app";
    import { onMount } from "svelte";
    import { send } from "net.js";
    import { formatDateTime } from "utils.js";

    const { session } = stores();

    let topics = [];
    let selected = [];

    onMount(async () => {
        topics = await send("topic.getAll");
    });

    async function deleteTopic() {
        if (selected.length) {
            await send("topic.delete", { id: selected });

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

<h1>Каталог мандел</h1>

{#if topics.length && $session.user}
    <button on:click={deleteTopic}>Удалить</button>
{/if}

<!-- {#each topics as topic}
    <p>
        {#if $session.user}
            <input type="checkbox" bind:group={selected} value={topic.id} />
        {/if}
        <a href="topic/{topic.id}">
            {formatDateTime(topic.create_ts)} | {topic.title}
        </a>
    </p>
{/each} -->

{#each topics as topic}
    <p>
        {#if $session.user}
            <input type="checkbox" bind:group={selected} value={topic[0]} />
        {/if}
        <a href="topic/{topic[0]}">
            {formatDateTime(topic[2])} | {topic[1]} |
            {#if topic[3]}{topic[3]}{:else}Конспиролог{/if}
        </a>
    </p>
{/each}
