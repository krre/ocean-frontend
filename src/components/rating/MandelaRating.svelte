<script lang="ts">
    import * as consts from "consts";
    import * as route from "route";
    import { goto, stores } from "@sapper/app";
    import { send } from "network";
    import { makeTitle } from "utils";
    import Pagination from "../Pagination.svelte";

    const { page } = stores();

    let mandels = [];
    let vote = 0;

    let pageNo = 1;
    let currentCount = 0;
    let lastPage = 0;

    let firstPageLink: string;
    let lastPageLink: string;
    let nextPageLink: string;
    let prevPageLink: string;

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
        goto(makeLink(pageNo));
    }

    $: if (process.browser && $page.query) {
        assignQuery();
        load();
        nonReactive.setPageInit();
    }

    function makeLink(page: number): string {
        const params = new URLSearchParams();

        if (page > 1) {
            params.append("page", page.toString());
        }

        if (vote) {
            params.append("vote", vote.toString());
        }

        const query = params.toString();
        return route.Rating + (query ? "?" + query : "");
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

        let result = await send("rating.getMandels", params);
        mandels = result.mandels;
        currentCount = result.total_count;

        lastPage = Math.ceil(currentCount / pageLimit);

        firstPageLink = makeLink(1);
        lastPageLink = makeLink(lastPage);
        nextPageLink = makeLink(pageNo + 1);
        prevPageLink = makeLink(pageNo - 1);
    }

    function mandelaLink(id: number, mandela, i: number) {
        const title = makeTitle(mandela);
        return `<a class="row-link" href="/mandela/${id}">${
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
    {currentCount}
    {pageLimit}
    {pageNo}
    {lastPage}
    {firstPageLink}
    {prevPageLink}
    {nextPageLink}
    {lastPageLink} />
