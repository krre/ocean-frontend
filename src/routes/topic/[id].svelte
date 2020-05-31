<script context="module">
    import { send } from "net.js";

    export async function preload(page, session) {
        const { id } = page.params;

        let result = await send("topic.getOne", { id: Number(id) });
        const topic = result[0];

        return { topic };
    }
</script>

<script>
    export let topic;
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
