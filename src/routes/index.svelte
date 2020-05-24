<script>
    import { stores } from "@sapper/app";
    import { onMount } from "svelte";
    import { send } from "net.js";
    import { formatDateTime } from "utils.js";

    const { session } = stores();

    let topics = [];
    let selected = [];

    onMount(async () => {
        const response = await send("topic.get");

        if (response.result) {
            topics = response.result;
        } else {
            console.error(response.error);
        }
    });

    async function deleteTopic() {
        if (selected.length) {
            const response = await send("topic.delete", { id: selected });

            if (response.error) {
                console.error(response.error);
                return;
            }

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
