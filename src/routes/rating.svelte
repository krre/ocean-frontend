<script>
    import * as consts from "consts.js";
    import { stores } from "@sapper/app";
    import { vote } from "stores.js";
    import { send } from "net.js";
    import { makeTitle } from "utils.js";

    const { session } = stores();

    const votes = [
        consts.VoteYesTitle,
        consts.VoteNoTitle,
        consts.VoteNeutralTitle
    ];

    let mandels = [];

    $: if (process.browser && $vote >= 0) {
        load();
    }

    async function load() {
        const params = {
            vote: $vote
        };

        mandels = await send("rating.getAll", params);
    }

    function mandelaLink(id, mandela) {
        const title = makeTitle(mandela);
        return `<a class="row-link" href="/mandela/${id}">${title}</a>`;
    }
</script>

<svelte:head>
    <title>Рейтинг</title>
</svelte:head>

<h1>Рейтинг</h1>
<select bind:value={$vote}>
    {#each votes as voteName, i}
        <option value={i} selected={$vote}>{voteName}</option>
    {/each}
</select>

<p />

{#each mandels as mandela}
    {@html mandelaLink(mandela.id, mandela)}
    <br />
{/each}
