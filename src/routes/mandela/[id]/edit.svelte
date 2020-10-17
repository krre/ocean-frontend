<script context="module" lang="ts">
    import { send } from "network";
    import * as route from "route";

    export async function preload(page, session) {
        const { id } = page.params;

        let result = await send("mandela.getOne", { id: Number(id) });
        const mandela = result.mandela;
        const categories = result.categories;

        return { id, mandela, categories, session };
    }
</script>

<script lang="ts">
    import * as consts from "consts";
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
                mandela.title_mode === consts.Mandela.Title.Simple
                    ? mandela.title
                    : "",
            what:
                mandela.title_mode === consts.Mandela.Title.Complex
                    ? mandela.what
                    : "",
            before:
                mandela.title_mode === consts.Mandela.Title.Complex
                    ? mandela.before
                    : "",
            after:
                mandela.title_mode === consts.Mandela.Title.Complex
                    ? mandela.after
                    : "",
            description: mandela.description,
            images: mandela.images,
            videos: mandela.videos,
            links: mandela.links,
            categories: categories,
            user_id: session.user.id,
        };

        await send("mandela.update", params);
        goto(route.Mandela.Id(id));
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
