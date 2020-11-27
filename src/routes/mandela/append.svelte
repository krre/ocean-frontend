<script lang="ts">
    import * as consts from "consts";
    import * as route from "route";
    import * as method from "method";
    import { goto, stores } from "@sapper/app";
    import { send } from "network";
    import Page from "../../components/Page.svelte";
    import MandelaEditor from "../../components/MandelaEditor.svelte";

    const { session } = stores();
    const pageTitle = "Добавить манделу";

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

        const result = await send(method.Mandela.Create, params);
        goto(route.Mandela.Id(result.id));
    }
</script>

<Page title={pageTitle}>
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
</Page>
