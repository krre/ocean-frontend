<script context="module" lang="ts">
    import { send } from "network";
    import { formatDateTime, listUserName } from "utils";
    import * as route from "route";

    export async function preload(page, session) {
        const { id } = page.params;

        const params: any = {
            id: +id,
        };

        if (session.user) {
            params.user_id = session.user.id;
        }

        let result = await send("mandela.getOne", params);
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
    import { goto } from "@sapper/app";
    import { stores } from "@sapper/app";
    import Comment from "../../../components/comment/Comment.svelte";

    const { page } = stores();

    export let id: number;
    export let mandela;
    export let votes;
    export let vote;
    export let totalVotes = 0;
    export let categories;
    export let session;

    let voteValue = -1;
    let editVote = false;

    $: if (session.user && mandela && !mandela.mark_ts) {
        mark();
    }

    let title =
        mandela.title_mode === consts.Mandela.Title.Simple
            ? mandela.title
            : mandela.what;

    function edit() {
        goto(route.Mandela.Edit(id));
    }

    function fixYouTubeLink(link) {
        return "https://www.youtube.com/embed/" + link.match(/([^\/]*$)/)[0];
    }

    async function mark() {
        const params = {
            id: mandela.id,
            user_id: session.user.id,
        };

        await send("mandela.mark", params);
    }

    async function castVote() {
        const params = {
            id: mandela.id,
            user_id: session.user.id,
            vote: voteValue,
        };

        votes = await send("mandela.vote", params);
        vote = voteValue;
        editVote = false;
        totalVotes = 0;

        for (let i in votes) {
            totalVotes += votes[i].count;
        }
    }

    function getVoteCount(vote) {
        for (let i in votes) {
            if (votes[i].vote === vote) {
                return votes[i].count;
            }
        }

        return 0;
    }

    function url() {
        return "http://" + $page.host + $page.path;
    }

    function copyLink(params) {
        navigator.clipboard.writeText(url());
    }

    function copyCode(params) {
        const code = `<a href="${url()}">Океан. Мандела №${id}</a>`;
        navigator.clipboard.writeText(code);
    }
</script>

<style>
    .message {
        white-space: pre-wrap;
    }

    .vote {
        display: block;
    }

    img {
        max-width: 100%;
        max-height: 100vh;
        width: auto;
        height: auto;
    }

    .video {
        max-width: 100%;
        max-height: auto;
        width: 420px;
        height: 315px;
    }
</style>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<h1>{title}</h1>

<p>
    ИД:
    {mandela.id}
    <br />
    Добавлено:
    {listUserName(mandela.user_name, mandela.user_id)}
    <br />
    Создано:
    {formatDateTime(mandela.create_ts)}
    {#if mandela.create_ts !== mandela.update_ts}
        <br />
        Изменено:
        {formatDateTime(mandela.update_ts)}
    {/if}
</p>

{#if mandela.mark_ts}
    <p>Просмотрено: {formatDateTime(mandela.mark_ts)}</p>
{/if}

<!-- <button on:click={copyLink}>Скопировать ссылку</button>
<button on:click={copyCode}>Скопировать код ссылки</button> -->

<hr />

{#if mandela.title_mode === consts.Mandela.Title.Complex}
    <p>Было: {mandela.before}</p>
    <p>Стало: {mandela.after}</p>
{/if}

{#if mandela.description}
    <div class="message">{mandela.description}</div>
    <hr />
{/if}

{#if mandela.images.length}
    {#each mandela.images as image}
        <div><img alt="" src={image} /></div>
    {/each}
    <hr />
{/if}

{#if mandela.videos.length}
    {#each mandela.videos as video}
        <div>
            <iframe
                class="video"
                title=""
                src={fixYouTubeLink(video)}
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope;
                picture-in-picture"
                allowfullscreen />
        </div>
    {/each}
    <hr />
{/if}

{#if mandela.links.length}
    {#each mandela.links as link}
        <div><a href={link}>{link}</a></div>
    {/each}
    <hr />
{/if}

{#if categories.length}
    Категории:
    {#each categories as category}{consts.Categories[category]}&nbsp;{/each}
    <hr />
{/if}

{#if session.user && session.user.id === mandela.user_id}
    <button on:click={edit}>Редактировать</button>
    <p />
{/if}

{#if session.user}
    {#if votes && !editVote}
        Результаты опроса:
        <ul>
            {#each consts.Votes as voteName, i}
                <li>{voteName}: {getVoteCount(i)}</li>
            {/each}
        </ul>
        <div>Всего голосов: {totalVotes}</div>
        <div>Выбрано: {consts.Votes[vote]}</div>
        <p>
            <button on:click={() => (editVote = true)}>Изменить выбор</button>
        </p>
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
    <hr />
{/if}

<Comment user={session.user} mandelaId={id} />
