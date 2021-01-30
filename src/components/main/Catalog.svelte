<script lang="ts">
    import * as consts from "consts";
    import * as route from "route";
    import * as api from "api";
    import type { User } from "types";
    import { onMount } from "svelte";
    import { Mounted } from "types";
    import { goto } from "@sapper/app";
    import { formatDateTime, zeroLeading, makeTitle } from "utils";
    import Indicator from "./Indicator.svelte";
    import Pagination from "../Pagination.svelte";
    import Frame from "../Frame.svelte";
    import SessionHub from "../SessionHub.svelte";

    export let pageLimit = 1;
    export let pageNo = 1;
    export let filter = 0;
    export let category = 0;
    export let sort = 0;
    export let getAllResponse: api.Mandela.GetAll.Response;

    let mounted = new Mounted();

    onMount(() => {
        mounted.setDone();
    });

    let baseQuery = new URLSearchParams();
    let user: User;

    let mandels: api.Mandela.GetAll.Mandela[] = [];
    let categories = ["Все"].concat(consts.Categories);
    let totalCount = 0;
    let newCount = 0;
    let mineCount = 0;
    let pollCount = 0;
    let categoryCount = 0;

    let currentCount = 0;
    let pageQuery = new URLSearchParams();

    const showAll = 0;
    const showNew = 1;
    const showMine = 2;
    const showPoll = 3;
    const showCategory = 4;
    const sorts = ["Манделам", "Комментариям"];
    const zeroLeadingCount = 4;

    $: {
        mandels = getAllResponse.mandels;
        totalCount = getAllResponse.total_count;
        newCount = getAllResponse.new_count;
        mineCount = getAllResponse.mine_count;
        pollCount = getAllResponse.poll_count;
        categoryCount = getAllResponse.category_count;

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
    }

    $: if (mounted.done()) {
        filter = category > 0 ? showCategory : showAll;
    }

    $: if (mounted.done() && filter >= 0 && category >= 0) {
        pageNo = 1;
        makeQueryAndGoto(false);
    }

    $: if (mounted.done() && sort >= 0) {
        makeQueryAndGoto();
    }

    function makeBaseQuery() {
        const params = new URLSearchParams();

        if (sort) {
            params.append("sort", sort.toString());
        }

        if (user) {
            if (filter) {
                params.append("filter", filter.toString());
            }

            if (filter != showCategory && category > 0) {
                category = 0;
            }

            if (category) {
                params.append("category", category.toString());
            }
        }

        baseQuery = params;
    }

    function makeQueryAndGoto(usePage: boolean = true) {
        makeBaseQuery();

        const gotoQuery = new URLSearchParams(baseQuery);

        if (usePage) {
            for (let params of pageQuery) {
                gotoQuery.append(params[0], params[1]);
            }
        }

        const queryString = gotoQuery.toString();
        goto((queryString ? "?" : "") + queryString);
    }
</script>

<style>
    .comments {
        color: red;
        display: inline;
        background-color: rgb(255, 247, 230);
        padding: 0 0.4em;
    }

    .new-mandela {
        color: red;
    }

    .row {
        display: block;
        margin: 0.3em 0;
    }

    .tool-bar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }

    .tool-bar-item {
        margin: 0.5em 0.2em;
    }
</style>

<SessionHub bind:user />

<Frame title="Океан. Каталог фактов эффекта Манделы" showHeader={false}>
    <div class="tool-bar">
        <Indicator
            title="Всего"
            count={totalCount}
            active={filter == showAll}
            on:clicked={() => (filter = showAll)}
        />
        {#if user}
            <Indicator
                title="Новые"
                count={newCount}
                active={filter == showNew}
                highlightNew={true}
                on:clicked={() => (filter = showNew)}
            />

            <Indicator
                title="Мои"
                count={mineCount}
                active={filter == showMine}
                on:clicked={() => (filter = showMine)}
            />

            <Indicator
                title="Опросы"
                count={pollCount}
                highlightNew={true}
                active={filter == showPoll}
                on:clicked={() => (filter = showPoll)}
            />
            <span class="tool-bar-item"
                >Категория:
                <select bind:value={category}>
                    {#each categories as categoryName, i}
                        <option value={i} selected={category == i}>
                            {categoryName}
                        </option>
                    {/each}
                </select>
            </span>
        {/if}
        <span class="tool-bar-item"
            >Сортировать по:
            <select bind:value={sort}>
                {#each sorts as sortName, i}
                    <option value={i} selected={sort == i}>{sortName}</option>
                {/each}
            </select>
        </span>
    </div>

    {#each mandels as mandela}
        <div class="row">
            <a class="row-link" href={route.Mandela.Id(mandela.id)}>
                <span class:new-mandela={user && !mandela.mark_ts}
                    >{zeroLeading(mandela.id, zeroLeadingCount)}</span
                >
                |
                {formatDateTime(mandela.create_ts)}
                |
                {makeTitle(mandela)}
                |
                {mandela.user_name}
                {#if mandela.comment_count}
                    | Комментариев:
                    <div class="comments">{mandela.comment_count}</div>
                {/if}
            </a>
        </div>
    {/each}
</Frame>

<Pagination
    count={currentCount}
    limit={pageLimit}
    offset={pageNo}
    {baseQuery}
    bind:pageQuery
/>
