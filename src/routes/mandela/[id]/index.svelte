<script context="module">
    import { send } from "net.js";
    import { formatDateTime, convertVotes, listUserName } from "utils.js";

    export async function preload(page, session) {
        const { id } = page.params;

        const params = {
            id: Number(id)
        };

        if (session.user) {
            params.user_id = session.user.id;
        }

        let result = await send("mandela.getOne", params);
        const mandela = result.mandela;

        let votes;

        if (result.votes) {
            votes = convertVotes(result.votes);
        }

        return { id, mandela, votes, session };
    }
</script>

<script>
    import * as consts from "consts.js";
    import { goto } from "@sapper/app";
    import Comment from "../../../components/comment/Comment.svelte";

    export let id;
    export let mandela;
    export let votes;
    export let session;

    let voteValue;

    const voteYesTitle = "Да, это мандела";
    const voteNoTitle = "Нет, всегда так было";
    const voteNeutralTitle = "Затрудняюсь ответить";

    $: if (session.user && mandela && !mandela.mark_ts) {
        mark();
    }

    let title =
        mandela.title_mode === consts.SimpleTitle
            ? mandela.title
            : mandela.what;

    function edit() {
        goto("mandela/" + id + "/edit");
    }

    function fixYouTubeLink(link) {
        return "https://www.youtube.com/embed/" + link.match(/([^\/]*$)/)[0];
    }

    async function mark() {
        const params = {
            id: mandela.id,
            user_id: session.user.id
        };

        await send("mandela.mark", params);
    }

    async function vote() {
        const params = {
            id: mandela.id,
            user_id: session.user.id,
            vote: voteValue - 1
        };

        const result = await send("mandela.vote", params);
        votes = convertVotes(result);
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
        width: 900px;
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
    ИД: {mandela.id}
    <br />
    Добавлено: {listUserName(mandela.user_name, mandela.user_id)}
    <br />
    Создано: {formatDateTime(mandela.create_ts)}
    {#if mandela.create_ts !== mandela.update_ts}
        <br />
        Изменено: {formatDateTime(mandela.update_ts)}
    {/if}
</p>

{#if mandela.mark_ts}
    <p>Просмотрено: {formatDateTime(mandela.mark_ts)}</p>
{/if}

<hr />

{#if mandela.title_mode === consts.ComplexTitle}
    <p>Было: {mandela.before}</p>
    <p>Стало: {mandela.after}</p>
{/if}

{#if mandela.description}
    <div class="message">{mandela.description}</div>
    <hr />
{/if}

{#if mandela.images.length}
    {#each mandela.images as image}
        <div>
            <img alt="" src={image} />
        </div>
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
        <div>
            <a href={link}>{link}</a>
        </div>
    {/each}
    <hr />
{/if}

{#if session.user && session.user.id === mandela.user_id}
    <button on:click={edit}>Редактировать</button>
    <p />
{/if}

{#if session.user}
    {#if votes}
        Результаты опроса
        <ul>
            <li>Всего голосов: {votes.total}</li>
            <li>{voteYesTitle}: {votes.yes}</li>
            <li>{voteNoTitle}: {votes.no}</li>
            <li>{voteNeutralTitle}: {votes.neutral}</li>
        </ul>
    {:else}
        Опрос. Является ли для вас это манделой?
        <p>
            <label class="vote">
                <input type="radio" bind:group={voteValue} value={1} />
                {voteYesTitle}
            </label>
            <label class="vote">
                <input type="radio" bind:group={voteValue} value={2} />
                {voteNoTitle}
            </label>
            <label class="vote">
                <input type="radio" bind:group={voteValue} value={3} />
                {voteNeutralTitle}
            </label>
        </p>
        <button on:click={vote} disabled={!voteValue}>Проголосовать</button>
    {/if}
    <hr />
{/if}

<Comment user={session.user} mandelaId={id} />
