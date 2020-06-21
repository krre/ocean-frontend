<script>
    import { send, errorMessage } from "net.js";
    import { makeTitle } from "utils.js";

    const searchContent = "0";
    const searchId = "1";
    let searchType = searchContent;
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

    function mandelaLink(id, mandela) {
        const title = makeTitle(mandela);
        return `<a target="_blank" href="/mandela/${id}">${title}</a>`;
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
            <option value={searchContent}>Содержимому</option>
            <option value={searchId}>Номеру</option>
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
            {@html mandelaLink(id, mandela)}
        {:else if mandels}
            {#each mandels as mandela}
                {@html mandelaLink(mandela.id, mandela)}
                <br />
            {/each}
        {/if}
    </div>
</div>
