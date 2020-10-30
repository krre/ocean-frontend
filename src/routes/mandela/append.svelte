<script lang="ts">
    import * as consts from "consts";
    import { goto, stores } from "@sapper/app";
    import { send } from "network";
    import MandelaEditor from "../../components/MandelaEditor.svelte";

    const { session } = stores();

    export let titleMode = consts.Mandela.Title.Simple;
    export let title = "";
    export let what = "";
    export let before = "";
    export let after = "";
    let description = "";
    let images = [];
    let videos = [];
    let links = [];
    let categories = [];

    async function append() {
        const params = {
            title_mode: titleMode,
            title: titleMode === consts.Mandela.Title.Simple ? title : "",
            what: titleMode === consts.Mandela.Title.Complex ? what : "",
            before: titleMode === consts.Mandela.Title.Complex ? before : "",
            after: titleMode === consts.Mandela.Title.Complex ? after : "",
            description: description,
            images: images,
            videos: videos,
            links: links,
            categories: categories,
        };

        const result = await send("mandela.create", params);
        goto("mandela/" + result.id);
    }
</script>

<svelte:head>
    <title>Добавить манделу</title>
</svelte:head>
<h1>Добавить манделу</h1>

<MandelaEditor
    bind:titleMode
    bind:title
    bind:what
    bind:before
    bind:after
    bind:description
    bind:images
    bind:videos
    bind:links
    bind:categories
    bind:user={$session.user}
    on:click={append} />
