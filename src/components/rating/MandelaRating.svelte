<script lang="ts">
    import * as consts from "consts";
    import * as route from "route";
    import * as api from "api";
    import type { MandelaVote } from "types";
    import { makeTitle } from "utils";

    export let pageNo = 1;
    export let pageLimit = 1;
    export let vote: MandelaVote;
    export let mandels: api.Rating.GetMandels.Mandela[] = [];

    function mandelaLink(
        id: number,
        mandela: api.Rating.GetMandels.Mandela,
        i: number
    ) {
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
