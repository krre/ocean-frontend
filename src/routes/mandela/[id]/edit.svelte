<script context="module">
    import { send } from "net.js";

    export async function preload(page, session) {
        const { id } = page.params;

        let result = await send("mandela.getOne", { id: Number(id) });
        const mandela = result.mandela;
        const categories = result.categories;

        return { id, mandela, categories, session };
    }
</script>

<script>
    import * as consts from "consts.js";
    import { goto } from "@sapper/app";
    import MandelaEditor from "../../../components/MandelaEditor.svelte";

    export let id;
    export let mandela;
    export let categories;
    export let session;

    async function edit() {
        const params = {
            id: Number(id),
            title_mode: mandela.title_mode,
            title:
                mandela.title_mode === consts.SimpleTitle ? mandela.title : "",
            what:
                mandela.title_mode === consts.ComplexTitle ? mandela.what : "",
            before:
                mandela.title_mode === consts.ComplexTitle
                    ? mandela.before
                    : "",
            after:
                mandela.title_mode === consts.ComplexTitle ? mandela.after : "",
            description: mandela.description,
            images: mandela.images,
            videos: mandela.videos,
            links: mandela.links,
            categories: categories,
            user_id: session.user.id
        };

        await send("mandela.update", params);
        goto("mandela/" + id);
    }
</script>

<svelte:head>
    <title>Редактировать манделу</title>
</svelte:head>
<h1>Редактировать манделу</h1>

<MandelaEditor
    bind:titleMode={mandela.title_mode}
    bind:title={mandela.title}
    bind:what={mandela.what}
    bind:before={mandela.before}
    bind:after={mandela.after}
    bind:description={mandela.description}
    bind:images={mandela.images}
    bind:videos={mandela.videos}
    bind:links={mandela.links}
    bind:categories
    bind:user={session.user}
    on:click={edit} />
