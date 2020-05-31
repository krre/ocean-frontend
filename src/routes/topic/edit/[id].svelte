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
    import TopicEditor from "../../../components/TopicEditor.svelte";

    export let id;
    export let topic;
    export let session;

    function edit() {
        console.log("edit", id, session, topic);
        goto("topic/" + id);
    }
</script>

<svelte:head>
    <title>Редактировать манделу</title>
</svelte:head>
<h1>Редактировать манделу</h1>

<TopicEditor
    bind:title={topic.title}
    bind:description={topic.description}
    bind:user={session.user}
    on:click={edit} />
