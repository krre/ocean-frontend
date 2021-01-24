<script context="module" lang="ts">
    import * as route from "route";
    import * as api from "api";
    import { formatDateTime } from "utils";
    import type { Session, Page } from "types";
    import Frame from "../../../components/Frame.svelte";

    export async function preload(page: Page, session: Session) {
        const id = +page.params.id;
        const url = "https://" + page.host + page.path;

        const params: api.Mandela.GetOne.Request = {
            id: id,
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

        return {
            id,
            mandela,
            votes,
            vote,
            totalVotes,
            categories,
            session,
            url,
        };
    }
</script>

<script lang="ts">
    import * as consts from "consts";
    import * as bbcode from "bbcode";
    import * as dialog from "dialog";
    import { goto } from "@sapper/app";
    import Comment from "../../../components/comment/Comment.svelte";
    import SessionHub from "../../../components/SessionHub.svelte";

    export let id: number;
    export let mandela: api.Mandela.GetOne.Mandela;
    export let votes: api.Mandela.GetOne.Vote[];
    export let vote: number;
    export let totalVotes = 0;
    export let categories: number[];
    export let session: Session;
    export let url: string;

    let htmlUrl = `<a href="${url}">Океан. Мандела №${id}</a>`;
    let bbCodeUrl = `⁅url="${url}"⁆Мандела №${id}⁅/url⁆`;

    let voteValue = -1;
    let editVote = false;
    let showMandelaLinks = false;
    let isAdmin = false;
    let isAnonym = true;

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

    async function remove() {
        if (!dialog.remove("Удалить манделу?")) return;

        const params: api.Mandela.Delete.Request = {
            id: [id],
        };

        await api.Mandela.Delete.exec(params);

        alert("Мандела удалена!");
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

    function copyLink(value: string) {
        navigator.clipboard.writeText(value);
    }
</script>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 1em;
    }

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

    .mandela-link {
        cursor: pointer;
        border-bottom-style: dashed;
        border-bottom-width: 1px;
        font-size: 0.9em;
        color: #5f5f5f;
    }

    .mandela-link-grid {
        width: min(40em, 100%);
        display: grid;
        gap: 0.5em;
        grid-template-columns: 1fr auto;
    }
</style>

<SessionHub bind:isAdmin bind:isAnonym />

<Frame {title}>
    <div class="container">
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

        {#if mandela.title_mode === consts.Mandela.Title.Complex}
            <div class="grid">
                <div>Было:</div>
                <div>{mandela.before}</div>
                <div>Стало:</div>
                <div>{mandela.after}</div>
            </div>
        {/if}

        {#if mandela.description}
            <div class="message">
                {@html bbcode.parse(mandela.description)}
            </div>
        {/if}

        {#if categories.length}
            Категории:
            {#each categories as category}{consts.Categories[
                    category
                ]}&nbsp;{/each}
        {/if}

        {#if !isAnonym && (session.user.id === mandela.user_id || isAdmin)}
            <div>
                {#if session.user.id === mandela.user_id}
                    <button on:click={edit}>Редактировать</button>
                {/if}

                {#if isAdmin}
                    <button on:click={remove}>Удалить</button>
                {/if}
            </div>
        {/if}

        {#if !session.user || (vote != null && !editVote)}
            <div>Результаты опроса:</div>
            <div class="grid" style="margin-left: 1em">
                {#each consts.Votes as voteName, i}
                    <div>{voteName}:</div>
                    <div>{getVoteCount(i)}</div>
                {/each}
            </div>
            <div class="grid">
                <div>Всего голосов:</div>
                <div>{totalVotes}</div>
                {#if session.user}
                    <div>Выбрано:</div>
                    <div>{consts.Votes[vote]}</div>
                {/if}
            </div>
            {#if session.user}
                <div>
                    <button on:click={() => (editVote = true)}
                        >Изменить выбор</button
                    >
                </div>
            {:else}Голосовать могут только зарегистрированные пользователи.{/if}
        {:else}
            <div>Является ли для вас это манделой?</div>
            <div>
                {#each consts.Votes as voteName, i}
                    <label class="vote">
                        <input type="radio" bind:group={voteValue} value={i} />
                        {voteName}
                    </label>
                {/each}
            </div>

            <div>
                <button on:click={castVote} disabled={voteValue < 0}>
                    Проголосовать
                </button>
            </div>
        {/if}

        <div on:click={() => (showMandelaLinks = !showMandelaLinks)}>
            <span class="mandela-link">Ссылка на манделу</span>
        </div>

        {#if showMandelaLinks}
            <div class="mandela-link-grid">
                <input readonly value={url} />
                <button on:click={() => copyLink(url)}
                    ><i class="far fa-copy" /></button
                >
                <input readonly value={htmlUrl} />
                <button on:click={() => copyLink(htmlUrl)}
                    ><i class="far fa-copy" /></button
                >
                <input readonly value={bbCodeUrl} />
                <button on:click={() => copyLink(bbCodeUrl)}
                    ><i class="far fa-copy" /></button
                >
            </div>
        {/if}
    </div>
</Frame>

<h2>Комментарии</h2>

<div class="comment">
    <Comment user={session.user} mandelaId={id} />
</div>
