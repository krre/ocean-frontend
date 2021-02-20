<script lang="ts">
    import * as api from "api";
    import { makeTitle } from "utils";
    import Frame from "../components/Frame.svelte";

    let content: string;
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
                content: content || "",
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
        display: flexbox;
        flex-direction: column;
    }

    .item {
        margin-top: 1em;
    }
</style>

<Frame title="Поиск">
    <div class="container">
        Введите текст:
        <input bind:value={content} on:keyup={keyPressed} />

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
