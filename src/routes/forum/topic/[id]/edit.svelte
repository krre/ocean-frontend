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
    import { goto } from "@sapper/app";
    import type { User } from "types";
    import * as route from "route";
    import Page from "../../../../components/Page.svelte";
    import Session from "../../../../components/Session.svelte";
    import TopicEditor from "../../../../components/forum/topic/TopicEditor.svelte";

    const title = "Редактировать тему";

    export let id: number;
    export let sectionId: number;
    export let name: string;
    export let userId: number;

    let isAdmin = false;
    let isAnonym = true;
    let user: User;

    $: editable = isAdmin || (user && user.id === userId && !isAnonym);

    const action = async () => {
        const params = {
            id: +id,
            name: name,
        };

        await send(method.Forum.Topic.Update, params);
        goto(route.Forum.Section.Id(sectionId));
    };
</script>

<Session bind:isAdmin bind:isAnonym bind:user />

<Page {title}>
    {#if !editable}
        Доступ запрещён
    {:else}
        <TopicEditor bind:name {action} />
    {/if}
</Page>
