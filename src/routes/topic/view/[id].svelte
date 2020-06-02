<script context="module">
    import { send } from "net.js";

    export async function preload(page, session) {
        const { id } = page.params;

        let result = await send("topic.getOne", { id: Number(id) });
        const topic = result[0];

        return { id, topic, session };
    }
</script>

<script>
    import { goto } from "@sapper/app";

    export let id;
    export let topic;
    export let session;

    function edit() {
        goto("topic/edit/" + id);
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
    <title>{topic.title}</title>
</svelte:head>

<h1>{topic.title}</h1>

{#if topic.description}
    <div class="message">{topic.description}</div>
    <hr />
{/if}

{#if topic.images.length}
    {#each topic.images as image}
        <div>
            <img alt="" src={image} />
        </div>
    {/each}
    <hr />
{/if}

{#if topic.videos.length}
    {#each topic.videos as video}
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

{#if topic.links.length}
    {#each topic.links as link}
        <div>
            <a href={link}>{link}</a>
        </div>
    {/each}
    <hr />
{/if}

{#if session.user && session.user.id === topic.user_id}
    <br />
    <button on:click={edit}>Редактировать</button>
{/if}
