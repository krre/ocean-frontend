<script>
    import * as consts from "consts.js";
    import { goto, stores } from "@sapper/app";
    import { send } from "net.js";
    import TopicEditor from "../../components/TopicEditor.svelte";

    const { session } = stores();

    let title = "";
    let description = "";
    let images = [];
    let videos = [];
    let links = [];

    async function append() {
        const params = {
            title: title,
            description: description,
            images: images,
            links: links,
            videos: videos,
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
    bind:images
    bind:videos
    bind:links
    bind:user={$session.user}
    on:click={append} />
