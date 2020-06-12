<script>
    import * as consts from "consts.js";
    import { stores } from "@sapper/app";
    import { onMount } from "svelte";
    import { send } from "net.js";
    import { formatDateTime, zeroLeading, listUserName } from "utils.js";

    const { session } = stores();

    export let currentPage;

    let mandels = [];
    let selected_delete = [];
    let selected_mark = [];

    let totalCount;
    const limit = 20;

    $: admin = $session.user && $session.user.code === consts.AdminAccount;
    $: lastPage = totalCount && Math.ceil(totalCount / limit);
    $: prevPageLink = `/page/${currentPage - 1}`;
    $: nextPageLink = `/page/${currentPage + 1}`;
    $: lastPageLink = `/page/${lastPage}`;

    $: if (currentPage && process.browser) {
        load();
    }

    async function load() {
        const params = {};
        params.limit = limit;
        params.offset = (currentPage - 1) * limit;
        let result = await send("mandela.getAll", params);
        mandels = result.mandels;
        totalCount = result.total_count;
    }

    async function deleteMandela() {
        if (!selected_delete.length) return;

        await send("mandela.delete", { id: selected_delete });

        mandels = mandels.filter(function(mandela) {
            return selected_delete.indexOf(mandela.id) === -1;
        });
        selected_delete = [];
    }

    async function mark() {
        console.log(selected_mark);
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

{#if admin && mandels.length}
    <button on:click={deleteMandela}>Удалить</button>
{/if}

{#if $session.user}
    <button on:click={mark} disabled={!selected_mark.length}>
        Отметить прочитанным
    </button>
{/if}

{#each mandels as mandela}
    <p>
        {#if admin}
            <input
                type="checkbox"
                bind:group={selected_delete}
                value={mandela.id} />
            Уд.
        {/if}
        {#if $session.user}
            <input
                type="checkbox"
                bind:group={selected_mark}
                disabled={mandela.mark_id}
                value={mandela.id} />
        {/if}
        <a href="mandela/{mandela.id}">
            {zeroLeading(mandela.id, 5)} | {formatDateTime(mandela.create_ts)} |
            {#if mandela.title_mode === consts.SimpleTitle}
                {mandela.title}
            {:else}{mandela.what}: {mandela.before} / {mandela.after}{/if}
            | {listUserName(mandela.user_name, mandela.user_id)} | Комментариев:
            {mandela.comment_count}
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
