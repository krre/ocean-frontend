<script lang="ts">
    import * as consts from "consts";
    import * as route from "route";
    import * as method from "method";
    import { goto, stores } from "@sapper/app";
    import { send } from "network";
    import { makeTitle } from "utils";
    import Pagination from "../Pagination.svelte";

    interface Mandela {
        after: string;
        before: string;
        count: number;
        id: number;
        title: string;
        title_mode: number;
        what: string;
    }

    const { page } = stores();

    let mandels: Mandela[] = [];
    let vote = 0;

    let pageNo = 1;
    let currentCount = 0;
    let baseQuery = new URLSearchParams();
    let pageQuery = new URLSearchParams();

    const pageLimit = 50;

    class NonReactive {
        pageInit = false;

        setPageInit() {
            this.pageInit = true;
        }
    }

    const nonReactive = new NonReactive();

    $: if (nonReactive.pageInit && vote >= 0) {
        pageNo = 1;
        makeBaseQuery();
        const queryString = baseQuery.toString();
        goto(route.Rating + (queryString ? "?" : "") + queryString);
    }

    $: if (process.browser && $page.query) {
        assignQuery();
        load();
        nonReactive.setPageInit();
    }

    function makeBaseQuery() {
        const params = new URLSearchParams();

        if (vote) {
            params.append("vote", vote.toString());
        }

        baseQuery = params;
    }

    function assignQuery() {
        pageNo = +$page.query.page || 1;
        vote = +$page.query.vote || 0;
    }

    async function load() {
        const params = {
            vote: vote,
            limit: pageLimit,
            offset: (pageNo - 1) * pageLimit,
        };

        let result = await send(method.Rating.GetMandels, params);
        mandels = result.mandels;
        currentCount = result.total_count;
    }

    function mandelaLink(id: number, mandela: Mandela, i: number) {
        const title = makeTitle(mandela);
        return `<a class="row-link" href=${route.Mandela.Id(id)}>${
            i + 1 + (pageNo - 1) * pageLimit
        }. ${title} - ${mandela.count}</a>`;
    }
</script>

<select bind:value={vote}>
    {#each consts.Votes as voteName, i}
        <option value={i} selected={vote == i}>{voteName}</option>
    {/each}
</select>

<p />

{#each mandels as mandela, i}
    {@html mandelaLink(mandela.id, mandela, i)}
    <br />
{/each}

<Pagination
    count={currentCount}
    limit={pageLimit}
    offset={pageNo}
    baseRoute={route.Rating}
    {baseQuery}
    bind:pageQuery />
