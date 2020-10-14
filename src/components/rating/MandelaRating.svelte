<script lang="ts">
    import * as consts from "consts";
    import { goto, stores } from "@sapper/app";
    import { send } from "network";
    import { makeTitle } from "utils";

    const { page } = stores();

    let mandels = [];
    let vote = 0;

    class NonReactive {
        pageInit = false;

        setPageInit() {
            this.pageInit = true;
        }
    }

    const nonReactive = new NonReactive();

    $: if (nonReactive.pageInit && vote >= 0) {
        const params = new URLSearchParams();

        if (vote) {
            params.append("vote", vote.toString());
        }

        const query = params.toString();
        const resQuery = consts.Route.Rating + (query ? "?" + query : "");
        goto(resQuery);
    }

    $: if (process.browser && $page.query) {
        assignQuery();
        load();
        nonReactive.setPageInit();
    }

    function assignQuery() {
        vote = +$page.query.vote || 0;
    }

    async function load() {
        const params = {
            vote: vote,
        };

        mandels = await send("rating.getMandels", params);
    }

    function mandelaLink(id: number, mandela, i: number) {
        const title = makeTitle(mandela);
        return `<a class="row-link" href="/mandela/${id}">${
            i + 1
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
