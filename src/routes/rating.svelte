<script>
    import * as consts from "consts.js";
    import { rating } from "stores.js";
    import { send } from "net.js";

    const ratings = [
        consts.VoteYesTitle,
        consts.VoteNoTitle,
        consts.VoteNeutralTitle
    ];

    let mandels;

    $: if (process.browser && $rating >= 0) {
        load();
    }

    async function load() {
        const params = {
            rating: $rating
        };

        mandels = await send("rating.getAll", params);

        console.log(params);
    }
</script>

<svelte:head>
    <title>Рейтинг</title>
</svelte:head>

<h1>Рейтинг</h1>
<p>Показаны будут только те манделы, за которые вы проголосовали.</p>
<select bind:value={$rating}>
    {#each ratings as ratingName, i}
        <option value={i} selected={$rating}>{ratingName}</option>
    {/each}
</select>
