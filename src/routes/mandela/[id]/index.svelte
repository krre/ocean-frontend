<script context="module" lang="ts">
    import * as route from "route";
    import * as api from "api";
    import { formatDateTime } from "utils";
    import type { Session, Page } from "types";
    import Frame from "../../../components/Frame.svelte";

    export async function preload(page: Page, session: Session) {
        const { id } = page.params;

        const params: api.Mandela.GetOne.Request = {
            id: +id,
        };

        const result = await api.Mandela.GetOne.exec(params);
        const mandela = result.mandela;
        const categories = result.categories;
        const votes = result.votes;
        const vote = result.vote;

        let totalVotes = 0;

        if (votes) {
            for (let i in votes) {
                totalVotes += votes[i].count;
            }
        }

        return { id, mandela, votes, vote, totalVotes, categories, session };
    }
</script>

<script lang="ts">
    import * as consts from "consts";
    import * as bbcode from "bbcode";
    import { goto } from "@sapper/app";
    import Comment from "../../../components/comment/Comment.svelte";

    export let id: number;
    export let mandela: api.Mandela.GetOne.Mandela;
    export let votes: api.Mandela.GetOne.Vote[];
    export let vote: number;
    export let totalVotes = 0;
    export let categories: number[];
    export let session: Session;

    let voteValue = -1;
    let editVote = false;

    $: if (process.browser && session.user && mandela && !mandela.mark_ts) {
        mark();
    }

    let title =
        mandela.title_mode === consts.Mandela.Title.Simple
            ? mandela.title
            : mandela.what;

    function edit() {
        goto(route.Mandela.Edit(id));
    }

    async function mark() {
        const params: api.Mandela.Mark.Request = {
            id: mandela.id,
        };

        await api.Mandela.Mark.exec(params);
    }

    async function castVote() {
        const params: api.Mandela.Vote.Request = {
            id: mandela.id,
            vote: voteValue,
        };

        votes = await api.Mandela.Vote.exec(params);
        vote = voteValue;
        editVote = false;
        totalVotes = 0;

        for (let i in votes) {
            totalVotes += votes[i].count;
        }
    }

    function getVoteCount(vote: number) {
        for (let i in votes) {
            if (votes[i].vote === vote) {
                return votes[i].count;
            }
        }

        return 0;
    }

    // function url() {
    //     return "http://" + $page.host + $page.path;
    // }

    // function copyLink(params) {
    //     navigator.clipboard.writeText(url());
    // }

    // function copyCode(params) {
    //     const code = `<a href="${url()}">Океан. Мандела №${id}</a>`;
    //     navigator.clipboard.writeText(code);
    // }
</script>

<style>
    .grid {
        display: grid;
        grid-template-columns: max-content auto;
        column-gap: 0.5em;
    }

    .message {
        white-space: pre-wrap;
        overflow-wrap: break-word;
        word-wrap: break-word;
    }

    .vote {
        display: block;
    }

    h2 {
        margin-left: 1rem;
    }

    .comment {
        margin: var(--page-margin);
    }

    @media screen and (max-width: 600px) {
        .comment {
            margin: var(--page-margin) 0;
        }
    }
</style>

<Frame {title}>
    <div class="grid">
        <div>ИД:</div>
        <div>{mandela.id}</div>
        <div>Добавлено:</div>
        <div>{mandela.user_name}</div>
        <div>Создано:</div>
        <div>{formatDateTime(mandela.create_ts)}</div>

        {#if mandela.create_ts !== mandela.update_ts}
            <div>Изменено:</div>
            <div>{formatDateTime(mandela.update_ts)}</div>
        {/if}
        {#if mandela.mark_ts}
            <div>Просмотрено:</div>
            <div>{formatDateTime(mandela.mark_ts)}</div>
        {/if}
    </div>

    <!-- <button on:click={copyLink}>Скопировать ссылку</button>
    <button on:click={copyCode}>Скопировать код ссылки</button> -->

    <hr />

    {#if mandela.title_mode === consts.Mandela.Title.Complex}
        <div class="grid">
            <div>Было:</div>
            <div>{mandela.before}</div>
            <div>Стало:</div>
            <div>{mandela.after}</div>
        </div>
    {/if}

    {#if mandela.description}
        <p />
        <div class="message">
            {@html bbcode.parse(mandela.description)}
        </div>
        <hr />
    {/if}

    {#if categories.length}
        Категории:
        {#each categories as category}{consts.Categories[category]}&nbsp;{/each}
        <hr />
    {/if}

    {#if session.user && session.user.id === mandela.user_id}
        <p />
        <button on:click={edit}>Редактировать</button>
        <p />
    {/if}

    {#if session.user}
        {#if votes && !editVote}
            <p>Результаты опроса:</p>
            <div class="grid" style="margin-left: 1em">
                {#each consts.Votes as voteName, i}
                    <div>{voteName}:</div>
                    <div>{getVoteCount(i)}</div>
                {/each}
            </div>
            <p />
            <div class="grid">
                <div>Всего голосов:</div>
                <div>{totalVotes}</div>
                <div>Выбрано:</div>
                <div>{consts.Votes[vote]}</div>
            </div>
            <p />
            <button on:click={() => (editVote = true)}>Изменить выбор</button>
        {:else}
            Является ли для вас это манделой?
            <p>
                {#each consts.Votes as voteName, i}
                    <label class="vote">
                        <input type="radio" bind:group={voteValue} value={i} />
                        {voteName}
                    </label>
                {/each}
            </p>
            <button on:click={castVote} disabled={voteValue < 0}>
                Проголосовать
            </button>
        {/if}
    {/if}
</Frame>

<h2>Комментарии</h2>

<div class="comment">
    <Comment user={session.user} mandelaId={id} />
</div>
