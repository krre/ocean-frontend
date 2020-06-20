<script>
    const searchId = "0";
    const searchContent = "1";
    let searchType = searchId;
    let id;

    function search() {
        console.log("search", searchType);

        if (searchType === searchId) {
            console.log(id);
        }
    }
</script>

<style>
    .container {
        display: flexbox;
        flex-direction: column;
    }

    .item {
        margin-top: 1em;
    }
</style>

<svelte:head>
    <title>Поиск</title>
</svelte:head>
<h1>Поиск</h1>

<div class="container">
    <div class="item">
        Искать по
        <select bind:value={searchType}>
            <option value={searchId}>Номеру</option>
            <option value={searchContent}>Содержимому</option>
        </select>
    </div>
    <div class="item">
        {#if searchType == searchId}
            Введите номер:
            <input type="number" bind:value={id} />
        {:else}В разработке{/if}
    </div>

    <div class="item">
        <button on:click={search}>Найти</button>
    </div>
</div>
