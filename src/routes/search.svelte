<script>
    import { send, errorMessage } from "net.js";
    import { makeTitle } from "utils.js";

    const searchId = "0";
    const searchContent = "1";
    let searchType = searchId;
    let id;
    let content;
    let mandela;
    let mandels;
    let searchInTitle = true;
    let searchInDescription = true;
    let emptyResult = false;

    async function search() {
        mandela = null;
        mandels = null;
        emptyResult = false;

        try {
            if (searchType === searchId) {
                mandela = await send("search.getById", { id: Number(id) });
                emptyResult = !mandela;
            } else {
                const params = {
                    content: content || "",
                    search_title: searchInTitle,
                    search_description: searchInDescription
                };
                mandels = await send("search.getByContent", params);
                emptyResult = !mandels.length;
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
        {:else}
            Введите строку:
            <input bind:value={content} />
            <br />
            <label>
                <input type="checkbox" bind:checked={searchInTitle} />
                Искать в заголовке
            </label>
            <br />
            <label>
                <input type="checkbox" bind:checked={searchInDescription} />
                Искать в описании
            </label>
        {/if}
    </div>

    <div class="item">
        <button on:click={search}>Найти</button>
    </div>

    <div class="item">
        {#if emptyResult}
            Ничего не найдено
        {:else if mandela}
            <a target="_blank" href="/mandela/{id}">{makeTitle(mandela)}</a>
        {:else if mandels}
            {#each mandels as mandela}
                <a target="_blank" href="/mandela/{mandela.id}">
                    {makeTitle(mandela)}
                </a>
                <br />
            {/each}
        {/if}
    </div>
</div>