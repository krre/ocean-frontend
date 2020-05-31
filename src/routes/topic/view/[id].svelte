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
<div class="message">{topic.description}</div>

{#if session.user && session.user.id === topic.user_id}
    <br />
    <button on:click={edit}>Редактировать</button>
{/if}
