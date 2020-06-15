<script context="module">
    import { send } from "net.js";
    import { formatDateTime } from "utils.js";

    export async function preload(page, session) {
        const { id } = page.params;

        const params = {
            id: Number(id)
        };

        if (session.user) {
            params.user_id = session.user.id;
        }

        let result = await send("mandela.getOne", params);
        const mandela = result[0];

        return { id, mandela, session };
    }
</script>

<script>
    import * as consts from "consts.js";
    import { goto } from "@sapper/app";
    import Comment from "../../../components/comment/Comment.svelte";

    export let id;
    export let mandela;
    export let session;

    let votes;

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
            vote: votes - 1
        };

        await send("mandela.vote", params);
    }
</script>

<style>
    .message {
        white-space: pre-wrap;
    }

    .vote {
        display: block;
    }
</style>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<h1>{title}</h1>

{#if mandela.mark_ts}
    <p>Просмотрено: {formatDateTime(mandela.mark_ts)}</p>
{/if}

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
                title=""
                width="420"
                height="315"
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
    Опрос. Является ли для вас это манделой?
    <p>
        <label class="vote">
            <input type="radio" bind:group={votes} value={1} />
            Да, это мандела
        </label>
        <label class="vote">
            <input type="radio" bind:group={votes} value={2} />
            Нет, всегда так было
        </label>
        <label class="vote">
            <input type="radio" bind:group={votes} value={3} />
            Затрудняюсь ответить
        </label>
    </p>
    <button on:click={vote} disabled={!votes}>Проголосовать</button>
    <hr />
{/if}

<Comment user={session.user} mandelaId={id} />
