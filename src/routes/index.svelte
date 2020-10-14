<script lang="ts">
    import * as consts from "consts";
    import { send } from "network";
    import { goto, stores } from "@sapper/app";
    import {
        formatDateTime,
        zeroLeading,
        listUserName,
        makeTitle,
    } from "utils";

    const { page, session } = stores();
    const user = $session.user;

    let pageNo = 1;
    let filter = 0;
    let category = 0;
    let sort = 0;

    let mandels = [];
    let totalCount = 0;
    let newCount = 0;
    let mineCount = 0;
    let categoryCount = 0;

    let selected_delete = [];
    let currentCount = 0;
    let lastPage = 0;

    let firstPageLink: string;
    let lastPageLink: string;
    let nextPageLink: string;
    let prevPageLink: string;

    const filters = ["Все", "Новые", "Мои", "Категория"];
    const showAll = 0;
    const showNew = 1;
    const showMine = 2;
    const showCategory = 3;
    const sorts = ["Манделам", "Комментариям"];
    const zeroLeadingCount = 3;
    const pageLimit = 50;

    class NonReactive {
        pageInit = false;

        setPageInit() {
            this.pageInit = true;
        }
    }

    const nonReactive = new NonReactive();

    $: admin = user && user.code === consts.Account.Admin;

    $: if (nonReactive.pageInit && filter >= 0 && category >= 0) {
        pageNo = 1;
        goto(makeLink(pageNo));
    }

    $: if (nonReactive.pageInit && sort >= 0) {
        goto(makeLink(pageNo));
    }

    $: if (process.browser && $page.query) {
        assignQuery();
        load();
        nonReactive.setPageInit();
    }

    function assignQuery() {
        pageNo = +$page.query.page || 1;
        filter = +$page.query.filter || 0;
        category = +$page.query.category || 0;
        sort = +$page.query.sort || 0;
    }

    async function load() {
        const params = {
            sort: sort,
            limit: pageLimit,
            offset: (pageNo - 1) * pageLimit,
        };

        if (user) {
            params.user_id = user.id;
            params.filter = filter;
            params.category = category;
        }

        let result = await send("mandela.getAll", params);
        mandels = result.mandels;
        totalCount = result.total_count;
        newCount = result.new_count;
        mineCount = result.mine_count;
        categoryCount = result.category_count;

        if (filter === showAll) {
            currentCount = totalCount;
        } else if (filter === showNew) {
            currentCount = newCount;
        } else if (filter === showMine) {
            currentCount = mineCount;
        } else if (filter === showCategory) {
            currentCount = categoryCount;
        }

        lastPage = Math.ceil(currentCount / pageLimit);

        firstPageLink = makeLink(1);
        lastPageLink = makeLink(lastPage);
        nextPageLink = makeLink(pageNo + 1);
        prevPageLink = makeLink(pageNo - 1);
    }

    function makeLink(page: number): string {
        const params = new URLSearchParams();

        if (page > 1) {
            params.append("page", page.toString());
        }

        if (sort) {
            params.append("sort", sort.toString());
        }

        if (user) {
            if (filter) {
                params.append("filter", filter.toString());
            }

            if (category) {
                params.append("category", category.toString());
            }
        }

        const query = params.toString();
        return query ? "?" + query : "";
    }

    async function deleteMandela() {
        if (!selected_delete.length) return;

        await send("mandela.delete", { id: selected_delete });

        mandels = mandels.filter(function (mandela) {
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
        text-decoration: none;
        color: rgb(51, 51, 51);
    }

    .pagination-item:hover {
        text-decoration: underline;
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
</style>

<svelte:head>
    <title>Океан. Каталог фактов эффекта Манделы</title>
</svelte:head>

{#if admin && mandels.length}
    <button on:click={deleteMandela}>Удалить</button>
    |
{/if}
Всего мандел:
{totalCount}
{#if user}
    | Новых:
    {#if newCount}
        <div class="new">{newCount}</div>
    {:else}{newCount}{/if}
    | Показать:
    <select bind:value={filter}>
        {#each filters as filterName, i}
            <option value={i} selected={filter == i}>{filterName}</option>
        {/each}
    </select>
    {#if filter === showCategory}
        <select bind:value={category}>
            {#each consts.Categories as categoryName, i}
                <option value={i} selected={category == i}>
                    {categoryName}
                </option>
            {/each}
        </select>
    {/if}
{/if}
| Сортировать по:
<select bind:value={sort}>
    {#each sorts as sortName, i}
        <option value={i} selected={sort == i}>{sortName}</option>
    {/each}
</select>
{#each mandels as mandela}
    <div class="row">
        {#if admin}
            <input
                type="checkbox"
                bind:group={selected_delete}
                value={mandela.id} />
        {/if}
        {#if user}
            {#if !mandela.mark_ts}
                <div class="new">Н</div>
            {:else}
                <div class="old">С</div>
            {/if}
        {/if}
        <a class="row-link" href="mandela/{mandela.id}">
            {zeroLeading(mandela.id, zeroLeadingCount)}
            |
            {formatDateTime(mandela.create_ts)}
            |
            {makeTitle(mandela)}
            |
            {listUserName(mandela.user_name, mandela.user_id)}
            | Комментариев:
            {#if mandela.comment_count}
                <div class="new">{mandela.comment_count}</div>
            {:else}0{/if}
        </a>
    </div>
{/each}

{#if currentCount && currentCount > pageLimit}
    <div class="pagination-container">
        {#if pageNo > 1}
            <a class="pagination-item" href={firstPageLink}>Первая</a>
            <a class="pagination-item" href={prevPageLink}>Предыдущая</a>
        {/if}

        <div class="pagination-item">{pageNo}</div>

        {#if pageNo < lastPage}
            <a class="pagination-item" href={nextPageLink}>Следующая</a>
            <a class="pagination-item" href={lastPageLink}>Последняя</a>
        {/if}
    </div>
{/if}
