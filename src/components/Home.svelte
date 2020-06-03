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
    const limit = 20;

    $: admin = $session.user && $session.user.code === consts.AdminAccount;
    $: lastPage = totalCount && Math.ceil(totalCount / limit);
    $: currentPage && load();
    $: prevPageLink = `/page/${currentPage - 1}`;
    $: nextPageLink = `/page/${currentPage + 1}`;
    $: lastPageLink = `/page/${lastPage}`;

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
    .pagination-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
        margin: 0 -5px;
    }

    .pagination-item {
        padding: 0 5px;
    }
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
    <div class="pagination-container">
        {#if currentPage > 1}
            <a class="pagination-item" href="/">Первая</a>
            <a class="pagination-item" href={prevPageLink}>Предыдущая</a>
        {/if}

        <div class="pagination-item">{currentPage}</div>

        {#if currentPage < lastPage}
            <a class="pagination-item" href={nextPageLink}>Следующая</a>
            <a href={lastPageLink}>Последняя</a>
        {/if}
    </div>
{/if}
