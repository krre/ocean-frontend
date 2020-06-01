<script>
    import * as consts from "consts.js";
    import { goto, stores } from "@sapper/app";
    import { send } from "net.js";
    import TopicEditor from "../../components/TopicEditor.svelte";

    const { session } = stores();

    let title = "";
    let description = "";
    let links = [];

    async function append() {
        const params = {
            title: title,
            description: description,
            links: links,
            user_id: $session.user ? $session.user.id : consts.FierceAccountId
        };

        await send("topic.create", params);
        goto("/");
    }
</script>

<svelte:head>
    <title>Добавить манделу</title>
</svelte:head>
<h1>Добавить манделу</h1>

<TopicEditor
    bind:title
    bind:description
    bind:links
    bind:user={$session.user}
    on:click={append} />
