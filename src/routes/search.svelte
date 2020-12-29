<script lang="ts">
    import { send } from "network";
    import { makeTitle } from "utils";
    import * as method from "method";
    import Page from "../components/Page.svelte";

    const title = "Поиск мандел";
    const searchContent = "0";
    const searchId = "1";

    interface Mandela {
        after: string;
        before: string;
        id?: number;
        title: string;
        title_mode: number;
        what: string;
    }

    let searchType = searchContent;
    let id: number;
    let content: string;
    let mandela: Mandela;
    let mandels: Mandela[];
    let searchInTitle = true;
    let searchInDescription = true;
    let emptyResult = false;

    async function search() {
        mandela = null;
        mandels = null;
        emptyResult = false;

        try {
            if (searchType === searchId) {
                mandela = await send(method.Search.GetById, { id: Number(id) });
                emptyResult = !mandela;
            } else {
                const params = {
                    content: content || "",
                    search_title: searchInTitle,
                    search_description: searchInDescription,
                };
                mandels = await send(method.Search.GetByContent, params);
                emptyResult = !mandels.length;
            }
        } catch (e) {
            console.error(e);
        }
    }

    function keyPressed(event: any) {
        if (event.key == "Enter") {
            search();
        }
    }

    function mandelaLink(id: number, mandela: Mandela) {
        const title = makeTitle(mandela);
        return `<a target="_blank" class="row-link" href="/mandela/${id}">${title}</a>`;
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

<Page {title}>
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
                <input type="number" bind:value={id} on:keyup={keyPressed} />
            {:else}
                Введите строку:
                <input bind:value={content} on:keyup={keyPressed} />
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

        <div class="item"><button on:click={search}>Найти</button></div>

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
</Page>
