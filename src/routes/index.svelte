<script lang="ts">
    import * as consts from "consts";
    import * as method from "method";
    import * as route from "route";
    import { send } from "network";
    import { goto, stores } from "@sapper/app";
    import {
        formatDateTime,
        zeroLeading,
        listUserName,
        makeTitle,
    } from "utils";
    import Pagination from "../components/Pagination.svelte";

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
    let pollCount = 0;
    let categoryCount = 0;

    let selected_delete = [];
    let currentCount = 0;
    let lastPage = 0;

    let firstPageLink: string;
    let lastPageLink: string;
    let nextPageLink: string;
    let prevPageLink: string;

    const filters = ["Все", "Новые", "Мои", "Опросы", "Категория"];
    const showAll = 0;
    const showNew = 1;
    const showMine = 2;
    const showPoll = 3;
    const showCategory = 4;
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
            params.filter = filter;
            params.category = category;
        }

        let result = await send(method.Mandela.GetAll, params);
        mandels = result.mandels;
        totalCount = result.total_count;
        newCount = result.new_count;
        mineCount = result.mine_count;
        pollCount = result.poll_count;
        categoryCount = result.category_count;

        if (filter === showAll) {
            currentCount = totalCount;
        } else if (filter === showNew) {
            currentCount = newCount;
        } else if (filter === showMine) {
            currentCount = mineCount;
        } else if (filter === showPoll) {
            currentCount = pollCount;
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

        await send(method.Mandela.Delete, { id: selected_delete });

        mandels = mandels.filter(function (mandela) {
            return selected_delete.indexOf(mandela.id) === -1;
        });
        selected_delete = [];
    }
</script>

<style>
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
Всего:
{totalCount}
{#if user}
    | Новых:
    {#if newCount}
        <div class="new">{newCount}</div>
    {:else}{newCount}{/if}
    | Моих:
    {mineCount}
    | Опросов:
    {#if pollCount}
        <div class="new">{pollCount}</div>
    {:else}{pollCount}{/if}
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
        <a class="row-link" href={route.Mandela.Id(mandela.id)}>
            {zeroLeading(mandela.id, zeroLeadingCount)}
            |
            {formatDateTime(mandela.create_ts)}
            |
            {makeTitle(mandela)}
            |
            {listUserName(mandela.user_name, mandela.user_id)}
            {#if mandela.comment_count}
                | Комментариев:
                <div class="new">{mandela.comment_count}</div>
            {/if}
        </a>
    </div>
{/each}

<Pagination
    {currentCount}
    {pageLimit}
    {pageNo}
    {lastPage}
    {firstPageLink}
    {prevPageLink}
    {nextPageLink}
    {lastPageLink} />
