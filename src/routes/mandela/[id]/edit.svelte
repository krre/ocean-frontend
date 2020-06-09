<script context="module">
    import { send } from "net.js";

    export async function preload(page, session) {
        const { id } = page.params;

        let result = await send("mandela.getOne", { id: Number(id) });
        const mandela = result[0];

        return { id, mandela, session };
    }
</script>

<script>
    import { goto } from "@sapper/app";
    import MandelaEditor from "../../../components/MandelaEditor.svelte";

    export let id;
    export let mandela;
    export let session;

    async function edit() {
        const params = {
            id: Number(id),
            title_mode: mandela.title_mode,
            title: mandela.title,
            what: mandela.what,
            before: mandela.before,
            after: mandela.after,
            description: mandela.description,
            images: mandela.images,
            videos: mandela.videos,
            links: mandela.links,
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
    bind:user={session.user}
    on:click={edit} />
