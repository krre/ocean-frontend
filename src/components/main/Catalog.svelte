<script lang="ts">
    import * as consts from "$lib/consts";
    import * as route from "$lib/route";
    import * as api from "$lib/api";
    import type { User } from "$lib/types";
    import { onMount } from "svelte";
    import { Mounted, Vote } from "$lib/types";
    import { goto } from "$app/navigation";
    import { formatDateTime, zeroLeading, makeTitle } from "$lib/utils";
    import Indicator from "./Indicator.svelte";
    import Pagination from "../Pagination.svelte";
    import Frame from "../Frame.svelte";
    import SessionHub from "../SessionHub.svelte";

    enum Filter {
        All,
        New,
        Mine,
        Poll,
        Trash,
        Category,
    }

    export let pageLimit = 1;
    export let pageNo = 1;
    export let filter = Filter.All;
    export let category = 0;
    export let sort = 0;
    export let userId = 0;
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
    let trashCount = 0;
    let categoryCount = 0;
    let userCount = 0;

    let currentCount = 0;
    let pageQuery = new URLSearchParams();

    const sorts = ["Манделам", "Комментариям"];
    const zeroLeadingCount = 4;

    $: {
        mandels = getAllResponse.mandels;
        totalCount = getAllResponse.total_count;
        newCount = getAllResponse.new_count;
        mineCount = getAllResponse.mine_count;
        pollCount = getAllResponse.poll_count;
        trashCount = getAllResponse.trash_count;
        categoryCount = getAllResponse.category_count;
        userCount = getAllResponse.user_count;

        if (userId) {
            currentCount = userCount;
        } else if (filter === Filter.All) {
            currentCount = totalCount;
        } else if (filter === Filter.New) {
            currentCount = newCount;
        } else if (filter === Filter.Mine) {
            currentCount = mineCount;
        } else if (filter === Filter.Poll) {
            currentCount = pollCount;
        } else if (filter === Filter.Trash) {
            currentCount = trashCount;
        } else if (filter === Filter.Category) {
            currentCount = categoryCount;
        }
    }

    $: if (mounted.done()) {
        filter = category > 0 ? Filter.Category : Filter.All;
    }

    $: if (mounted.done() && filter >= 0 && category >= 0) {
        pageNo = 1;
        makeQueryAndGoto(false);
    }

    $: if (mounted.done() && sort >= 0) {
        makeQueryAndGoto();
    }

    $: if (userId) {
        makeBaseQuery();
    }

    function makeBaseQuery() {
        const params = new URLSearchParams();

        if (filter != Filter.Category && category > 0) {
            category = 0;
        }

        if (sort) {
            params.append("sort", sort.toString());
        }

        if (category) {
            params.append("category", category.toString());
        }

        if (filter) {
            params.append("filter", filter.toString());
        }

        if (userId) {
            params.append("user", userId.toString());
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

    function voteColor(votes: api.Mandela.Vote[]): string {
        let maxCount = 0;
        let maxVote = Vote.Neutral;

        for (const vote of votes) {
            if (vote.count > maxCount) {
                maxCount = vote.count;
                maxVote = vote.vote;
            }
        }

        return consts.VoteColors[maxVote];
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
        gap: 0.5em;
        margin-bottom: 0.7em;
    }
</style>

<SessionHub bind:user />

<Frame title="Океан. Каталог фактов эффекта Манделы" showHeader={false}>
    <div class="tool-bar">
        {#if !userId}
            <Indicator
                title="Всего"
                count={totalCount}
                active={filter == Filter.All}
                on:clicked={() => (filter = Filter.All)}
            />
            {#if user}
                <Indicator
                    title="Новые"
                    count={newCount}
                    active={filter == Filter.New}
                    highlightNew={true}
                    on:clicked={() => (filter = Filter.New)}
                />

                <Indicator
                    title="Мои"
                    count={mineCount}
                    active={filter == Filter.Mine}
                    on:clicked={() => (filter = Filter.Mine)}
                />

                <Indicator
                    title="Опросы"
                    count={pollCount}
                    highlightNew={true}
                    active={filter == Filter.Poll}
                    on:clicked={() => (filter = Filter.Poll)}
                />
            {/if}

            <Indicator
                title="Хлам"
                count={trashCount}
                active={filter == Filter.Trash}
                on:clicked={() => (filter = Filter.Trash)}
            />
        {/if}

        <span
            >Категория:
            <select bind:value={category}>
                {#each categories as categoryName, i}
                    <option value={i} selected={category == i}>
                        {categoryName}
                    </option>
                {/each}
            </select>
        </span>
        <span
            >Сортировать по:
            <select bind:value={sort}>
                {#each sorts as sortName, i}
                    <option value={i} selected={sort == i}>{sortName}</option>
                {/each}
            </select>
        </span>
    </div>

    {#each mandels as mandela}
        <div class="row" style="background-color: {voteColor(mandela.votes)}">
            <a class="row-link" href={route.Mandela.Id(mandela.id)}>
                <span class:new-mandela={user && !mandela.mark_ts}
                    >{zeroLeading(mandela.id, zeroLeadingCount)}</span
                >
                ·
                {formatDateTime(mandela.create_ts)}
                ·
                {makeTitle(mandela)}
                ·
                {mandela.user_name}
                {#if mandela.comment_count}
                    · Комментариев:
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
