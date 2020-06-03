<script>
    import * as consts from "consts.js";
    import { stores } from "@sapper/app";
    import { onMount } from "svelte";
    import { send } from "net.js";
    import { formatDateTime, zeroLeading } from "utils.js";

    const { session } = stores();

    $: admin = $session.user && $session.user.code === consts.AdminAccount;

    export let currentPage = 1;

    let topics = [];
    let selected = [];

    let totalCount;
    let limit = 5;

    onMount(async () => load());

    async function load() {
        const params = {};
        params.limit = limit;
        params.offset = (currentPage - 1) * limit;
        topics = await send("topic.getAll", params);
    }

    async function deleteTopic() {
        if (!selected.length) return;

        await send("topic.delete", { id: selected });

        topics = topics.filter(function(topic) {
            // TODO: Change on topic.id when has topic object instead array.
            return selected.indexOf(topic[0]) === -1;
        });
        selected = [];
    }
</script>

<style>

</style>

<svelte:head>
    <title>Океан. Каталог фактов эффекта Манделы</title>
</svelte:head>

<h1>Каталог мандел</h1>

{#if topics.length && admin}
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
        {#if admin}
            <input type="checkbox" bind:group={selected} value={topic[0]} />
        {/if}
        <a href="mandela/{topic[0]}">
            {zeroLeading(topic[0], 5)} | {formatDateTime(topic[2])} | {topic[1]}
            |
            {#if topic[3]}
                {topic[3]}
            {:else if topic[4] === consts.FierceAccountId}
                {consts.AccountModeNames[consts.FierceAccount]}
            {:else}{consts.AccountModeNames[consts.ConspiratorAccount]}{/if}
        </a>
    </p>
{/each}
