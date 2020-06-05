<script context="module">
    import { send } from "net.js";

    export async function preload(page, session) {
        const { id } = page.params;

        let result = await send("mandela.getOne", { id: Number(id) });
        const mandela = result[0];

        return { id, mandela, session };
    }
</script>

<script>
    import { goto } from "@sapper/app";
    import Comment from "../../../components/Comment.svelte";

    export let id;
    export let mandela;
    export let session;

    function edit() {
        goto("mandela/" + id + "/edit");
    }

    function fixYouTubeLink(link) {
        return "https://www.youtube.com/embed/" + link.match(/([^\/]*$)/)[0];
    }
</script>

<style>
    .message {
        white-space: pre-wrap;
    }
</style>

<svelte:head>
    <title>{mandela.title}</title>
</svelte:head>

<h1>{mandela.title}</h1>

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

<Comment user={session.user} mandelaId={id} />
