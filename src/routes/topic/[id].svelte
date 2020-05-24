<script context="module">
    import { send } from "net.js";

    export async function preload(page, session) {
        const { id } = page.params;

        let response = await send("topic.get", { id: Number(id) });

        if (response.error) {
            console.error(response.error);
            return;
        }

        const topic = response.result[0];

        return { topic };
    }
</script>

<script>
    export let topic;
</script>

<svelte:head>
    <title>{topic.title}</title>
</svelte:head>

<h1>{topic.title}</h1>
{topic.description}
