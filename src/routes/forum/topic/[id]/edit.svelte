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
        const userId = result.user_id;

        return { id, sectionId, name, userId };
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
    export let userId: number;

    let isAdmin = false;
    let isFierce = false;
    let user;
    let editable = false;

    $: if (user) {
        editable = user.id === userId && !isFierce;
    }

    const action = async () => {
        const params = {
            id: +id,
            name: name,
        };

        await send(method.Forum.Topic.Update, params);
        goto(route.Forum.Section.Id(sectionId));
    };
</script>

<Session bind:isAdmin bind:isFierce bind:user />

<svelte:head>
    <title>{title}</title>
</svelte:head>

<h1>{title}</h1>

{#if !editable}
    Доступ запрещён
{:else}
    <TopicEditor bind:name {action} />
{/if}
