<script lang="ts">
    import * as consts from "consts";
    import { stores } from "@sapper/app";
    import { vote } from "stores";
    import { send } from "network";
    import { makeTitle } from "utils";

    const { session } = stores();

    let mandels = [];

    $: if (process.browser && $vote >= 0) {
        load();
    }

    async function load() {
        const params = {
            vote: $vote
        };

        mandels = await send("rating.getMandels", params);
    }

    function mandelaLink(id, mandela, i) {
        const title = makeTitle(mandela);
        return `<a class="row-link" href="/mandela/${id}">${i +
            1}. ${title} - ${mandela.count}</a>`;
    }
</script>

<select bind:value={$vote}>
    {#each consts.Votes as voteName, i}
        <option value={i} selected={$vote}>{voteName}</option>
    {/each}
</select>

<p />

{#each mandels as mandela, i}
    {@html mandelaLink(mandela.id, mandela, i)}
    <br />
{/each}
