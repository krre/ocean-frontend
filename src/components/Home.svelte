<script>
    import * as consts from "consts.js";
    import { stores } from "@sapper/app";
    import { onMount } from "svelte";
    import { send } from "net.js";
    import {
        formatDateTime,
        zeroLeading,
        listUserName,
        makeTitle
    } from "utils.js";

    const { session } = stores();

    export let currentPage;
    export let filter = 0;

    let mandels = [];
    let selected_delete = [];

    let totalCount = 0;
    let newCount = 0;
    let mineCount = 0;
    let currentCount = 0;
    let currentCategory = 0;
    let allCategories = ["Все"].concat(consts.Categories);
    const limit = 50;
    const zeroLeadingCount = 3;

    $: admin = $session.user && $session.user.code === consts.AdminAccount;
    $: lastPage = currentCount && Math.ceil(currentCount / limit);
    $: prevPageLink = `/page/${currentPage - 1}/${filter}`;
    $: nextPageLink = `/page/${currentPage + 1}/${filter}`;
    $: firstPageLink = `/page/1/${filter}`;
    $: lastPageLink = `/page/${lastPage}/${filter}`;

    $: if (Number(filter) === consts.ShowAll) {
        currentCount = totalCount;
    } else if (Number(filter) === consts.ShowNew) {
        currentCount = newCount;
    } else {
        currentCount = mineCount;
    }

    $: if (
        currentPage &&
        process.browser &&
        filter >= 0 &&
        currentCategory >= 0
    ) {
        load();
    }

    async function load() {
        const params = {
            limit: limit,
            offset: (currentPage - 1) * limit,
            category: currentCategory - 1
        };

        if ($session.user) {
            params.user_id = $session.user.id;
            params.filter = Number(filter);
        }

        let result = await send("mandela.getAll", params);
        mandels = result.mandels;
        totalCount = result.total_count;
        newCount = result.new_count;
        mineCount = result.mine_count;
    }

    async function deleteMandela() {
        if (!selected_delete.length) return;

        await send("mandela.delete", { id: selected_delete });

        mandels = mandels.filter(function(mandela) {
            return selected_delete.indexOf(mandela.id) === -1;
        });
        selected_delete = [];
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

    .new {
        color: red;
        display: inline;
        background-color: rgb(255, 247, 230);
        padding: 0 0.4em;
    }

    .old {
        color: rgb(0, 204, 92);
        display: inline;
        background-color: rgb(255, 247, 230);
        padding: 0 0.4em;
    }

    .row {
        display: block;
        margin: 0.3em 0;
    }

    .row-link {
        text-decoration: none;
        color: rgb(51, 51, 51);
    }

    .row-link:hover {
        text-decoration: underline;
    }
</style>

<svelte:head>
    <title>Океан. Каталог фактов эффекта Манделы</title>
</svelte:head>

{#if admin && mandels.length}
    <button on:click={deleteMandela}>Удалить</button>
    |
{/if}
Всего мандел: {totalCount}
{#if $session.user}
    | Новых:
    {#if newCount}
        <div class="new">{newCount}</div>
    {:else}{newCount}{/if}
    | Показать
    <select bind:value={filter}>
        <option value="0" selected={filter}>Все</option>
        <option value="1" selected={filter}>Новые</option>
        <option value="2" selected={filter}>Мои</option>
    </select>
    | Категории
    <select bind:value={currentCategory}>
        {#each allCategories as category, i}
            <option value={i} selected={currentCategory}>{category}</option>
        {/each}
    </select>
{/if}

{#each mandels as mandela}
    <div class="row">
        {#if admin}
            <input
                type="checkbox"
                bind:group={selected_delete}
                value={mandela.id} />
        {/if}
        {#if $session.user}
            {#if !mandela.mark_ts}
                <div class="new">Н</div>
            {:else}
                <div class="old">С</div>
            {/if}
        {/if}
        <a class="row-link" href="mandela/{mandela.id}">
            {zeroLeading(mandela.id, zeroLeadingCount)} | {formatDateTime(mandela.create_ts)}
            | {makeTitle(mandela)} | {listUserName(mandela.user_name, mandela.user_id)}
            | Комментариев:
            {#if mandela.comment_count}
                <div class="new">{mandela.comment_count}</div>
            {:else}0{/if}
        </a>
    </div>
{/each}

{#if currentCount && currentCount > limit}
    <div class="pagination-container">
        {#if currentPage > 1}
            <a class="pagination-item" href={firstPageLink}>Первая</a>
            <a class="pagination-item" href={prevPageLink}>Предыдущая</a>
        {/if}

        <div class="pagination-item">{currentPage}</div>

        {#if currentPage < lastPage}
            <a class="pagination-item" href={nextPageLink}>Следующая</a>
            <a href={lastPageLink}>Последняя</a>
        {/if}
    </div>
{/if}
