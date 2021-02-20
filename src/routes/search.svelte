<script lang="ts">
    import * as api from "api";
    import { makeTitle } from "utils";
    import Frame from "../components/Frame.svelte";

    const searchContent = "0";
    const searchId = "1";

    let searchType = searchContent;
    let id: number;
    let content: string;
    let mandels: api.Search.Mandela[] = [];
    let start = true;

    $: searchType && clear();

    function clear() {
        start = true;
        mandels = [];
    }

    async function search() {
        clear();

        try {
            if (searchType === searchId) {
                const params: api.Search.GetById.Request = {
                    id: Number(id),
                };
                const mandela = await api.Search.GetById.exec(params);

                if (mandela) {
                    mandela.id = id;
                    mandels.push(mandela);
                    mandels = mandels;
                }
            } else {
                const params: api.Search.GetByContent.Request = {
                    content: content || "",
                };

                mandels = await api.Search.GetByContent.exec(params);
            }

            start = false;
        } catch (e) {
            console.error(e);
        }
    }

    function keyPressed(event: any) {
        if (event.key == "Enter") {
            search();
        }
    }

    function mandelaLink(id: number, mandela: api.Search.Mandela) {
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

<Frame title="Поиск">
    <div class="container">
        <div class="item">
            Искать по:
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
            {/if}
        </div>

        <div class="item"><button on:click={search}>Найти</button></div>

        {#if mandels.length}
            <br />
            {#each mandels as mandela}
                {@html mandelaLink(mandela.id, mandela)}
                <br />
            {/each}
        {:else if !start}<br /> Ничего не найдено{/if}
    </div>
</Frame>
