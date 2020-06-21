<script>
    import { send, errorMessage } from "net.js";
    import { makeTitle } from "utils.js";

    const searchId = "0";
    const searchContent = "1";
    let searchType = searchId;
    let id;
    let mandela;
    let emptyResult = false;

    async function search() {
        mandela = null;
        emptyResult = false;

        try {
            if (searchType === searchId) {
                mandela = await send("search.getById", { id: Number(id) });
                emptyResult = !mandela;
                console.log(result);
            }
        } catch (e) {
            console.log(e);
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
    <title>Поиск мандел</title>
</svelte:head>
<h1>Поиск мандел</h1>

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

    <div class="item">
        {#if mandela}
            <a href="/mandela/{id}">{makeTitle(mandela)}</a>
        {:else if emptyResult}Ничего не найдено{/if}
    </div>
</div>
