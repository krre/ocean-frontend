<script lang="ts">
    import MandelaRating from "../components/rating/MandelaRating.svelte";
    import UserRating from "../components/rating/UserRating.svelte";

    let type = 0;
</script>

<svelte:head>
    <title>Рейтинг</title>
</svelte:head>

<h1>Рейтинг</h1>

<label> <input type="radio" bind:group={type} value={0} /> Манделы </label>

<label> <input type="radio" bind:group={type} value={1} /> Пользователи </label>

<p />

{#if type === 0}
    <MandelaRating />
{:else}
    <UserRating />
{/if}
