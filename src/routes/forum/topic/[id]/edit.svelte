<script context="module" lang="ts">
    import { send } from "network";
    import * as method from "method";

    export async function preload(page, session) {
        const { id } = page.params;

        let result = await send(method.Forum.Topic.GetOne, {
            id: +id,
        });
        const name = result.name;
        const sectionId = result.section_id;

        return { id, sectionId, name };
    }
</script>

<script lang="ts">
    import { goto, stores } from "@sapper/app";
    import * as route from "route";
    import Session from "../../../../components/Session.svelte";
    import TopicEditor from "../../../../components/forum/topic/TopicEditor.svelte";

    const { page } = stores();
    const title = "Редактировать тему";

    export let id: number;
    export let sectionId: number;
    export let name: string;

    let isAdmin = false;

    const action = async () => {
        const params = {
            id: +id,
            name: name,
        };

        await send(method.Forum.Topic.Update, params);
        goto(route.Forum.Section.Id(sectionId));
    };
</script>

<Session bind:isAdmin />

<svelte:head>
    <title>{title}</title>
</svelte:head>

<h1>{title}</h1>

{#if !isAdmin}
    Доступ запрещён
{:else}
    <TopicEditor bind:name {action} />
{/if}
