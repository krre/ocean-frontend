<script>
    import * as consts from "consts.js";
    import { stores } from "@sapper/app";
    import { onMount } from "svelte";
    import { send } from "net.js";
    import { formatDateTime, zeroLeading } from "utils.js";

    const { session } = stores();

    export let currentPage;

    let topics = [];
    let selected = [];

    let totalCount;
    const limit = 5;

    $: admin = $session.user && $session.user.code === consts.AdminAccount;
    $: prevPageLink = `/page/${currentPage - 1}`;
    $: nextPageLink = `/page/${currentPage + 1}`;
    $: lastPage = totalCount && Math.ceil(totalCount / limit);
    $: currentPage && load();

    async function load() {
        const params = {};
        params.limit = limit;
        params.offset = (currentPage - 1) * limit;
        let result = await send("topic.getAll", params);
        topics = result.topics;
        totalCount = result.total_count;
    }

    async function deleteTopic() {
        if (!selected.length) return;

        await send("topic.delete", { id: selected });

        topics = topics.filter(function(topic) {
            return selected.indexOf(topic.id) === -1;
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

{#each topics as topic}
    <p>
        {#if admin}
            <input type="checkbox" bind:group={selected} value={topic.id} />
        {/if}
        <a href="mandela/{topic.id}">
            {zeroLeading(topic.id, 5)} | {formatDateTime(topic.create_ts)} | {topic.title}
            |
            {#if topic.name}
                {topic.name}
            {:else if topic.user_id === consts.FierceAccountId}
                {consts.AccountModeNames[consts.FierceAccount]}
            {:else}{consts.AccountModeNames[consts.ConspiratorAccount]}{/if}
        </a>
    </p>
{/each}

{#if totalCount && totalCount > limit}
    {#if currentPage > 1}
        <a href={prevPageLink}>Назад</a>
    {/if}

    {#if currentPage < lastPage}
        <a href={nextPageLink}>Вперёд</a>
    {/if}
{/if}
