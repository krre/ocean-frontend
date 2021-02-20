<script lang="ts">
    import * as route from "route";
    import * as api from "api";
    import * as consts from "consts";
    import { pageUrl } from "utils";
    import Frame from "../components/Frame.svelte";
    import Rectangle from "../components/Rectangle.svelte";

    enum Type {
        Mandela,
        Comment,
        ForumPost,
    }

    const PAGE_LIMIT = 30;

    let type = Type.Mandela;
    let text = "";
    let records: api.Search.GetAll.Record[] = [];
    let start = true;
    let pageNo = 1;

    function clear() {
        start = true;
        records = [];
    }

    async function search() {
        clear();

        try {
            const params: api.Search.GetAll.Request = {
                text,
                type: type,
                limit: PAGE_LIMIT,
                offset: (pageNo - 1) * PAGE_LIMIT,
            };

            const result = await api.Search.GetAll.exec(params);
            records = result.records;
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

    function recordTitle(
        titleId: number,
        title: string,
        id: number,
        row: number
    ) {
        if (type == Type.Mandela) {
            return `<a target="_blank" href="${route.Mandela.Id(
                titleId
            )}">${title}</a>`;
        } else if (type == Type.Comment) {
            const page = Math.ceil(row / consts.Mandela.Comment.PageLimit);
            return pageUrl(route.Mandela.Id(titleId), title, id, page, true);
        } else {
            const page = Math.ceil(row / consts.Forum.Post.PageLimit);
            return pageUrl(
                route.Forum.Topic.Id(titleId),
                title,
                id,
                page,
                true
            );
        }
    }
</script>

<style>
    .container {
        display: flex;
        flex-direction: column;
        max-width: 30em;
        gap: 0.7em;
    }

    .record {
        border-bottom: var(--border-1px);
        padding: var(--page-padding);
    }

    .record:last-child {
        border-bottom: none;
    }

    .content {
        margin-top: 1em;
        white-space: pre-wrap;
        overflow-wrap: break-word;
        word-wrap: break-word;
    }
</style>

<Frame title="Поиск">
    <div class="container">
        Искать по:
        <div>
            <select bind:value={type}>
                <option value={Type.Mandela}>манделам</option>
                <option value={Type.Comment}>комментариям</option>
                <option value={Type.ForumPost}>форуму</option>
            </select>
        </div>

        Введите текст:
        <input bind:value={text} on:keyup={keyPressed} />
        <div><button on:click={search}>Найти</button></div>
    </div>
</Frame>

{#if records.length}
    <Rectangle padding={false}>
        {#each records as record}
            <div class="record">
                {@html recordTitle(
                    record.title_id,
                    record.title,
                    record.id,
                    record.row
                )}

                <div class="content">
                    {@html record.content}
                </div>
            </div>
        {/each}
    </Rectangle>
{/if}

{#if !start && records.length == 0}
    <Rectangle>Ничего не найдено</Rectangle>
{/if}
