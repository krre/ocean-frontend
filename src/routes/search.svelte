<script lang="ts">
    import * as api from "api";
    import { makeTitle } from "utils";
    import Frame from "../components/Frame.svelte";
    import Rectangle from "../components/Rectangle.svelte";

    enum Type {
        Mandela,
        Comment,
        Forum,
    }

    let type = Type.Mandela;
    let text = "";
    let mandels: api.Search.Mandela[] = [];
    let start = true;

    function clear() {
        start = true;
        mandels = [];
    }

    async function search() {
        clear();

        try {
            const params: api.Search.GetAll.Request = {
                text,
                type: type,
            };

            mandels = await api.Search.GetAll.exec(params);
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
        display: flex;
        flex-direction: column;
        max-width: 30em;
        gap: 0.7em;
    }
</style>

<Frame title="Поиск">
    <div class="container">
        Искать по:
        <div>
            <select bind:value={type}>
                <option value={Type.Mandela}>манделам</option>
                <option value={Type.Comment}>комментариям</option>
                <option value={Type.Forum}>форуму</option>
            </select>
        </div>

        Введите текст:
        <input bind:value={text} on:keyup={keyPressed} />
        <div><button on:click={search}>Найти</button></div>
    </div>
</Frame>

{#if !start}
    <Rectangle>
        {#if mandels.length}
            {#each mandels as mandela}
                {@html mandelaLink(mandela.id, mandela)}
                <br />
            {/each}
        {:else if !start}Ничего не найдено{/if}
    </Rectangle>
{/if}
