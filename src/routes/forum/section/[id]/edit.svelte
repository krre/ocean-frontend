<script context="module" lang="ts">
    import * as api from "api";
    import type { Session, Page } from "types";

    export async function preload(page: Page, _session: Session) {
        const { id } = page.params;
        const params: api.Forum.Section.GetOne.Request = {
            id: Number(id),
        };

        const result = await api.Forum.Section.GetOne.exec(params);
        const name = result.name;
        const order = result.order_index;

        return { id, name, order };
    }
</script>

<script lang="ts">
    import { goto } from "@sapper/app";
    import * as route from "route";
    import Frame from "../../../../components/Frame.svelte";
    import SessionHub from "../../../../components/SessionHub.svelte";
    import SectionEditor from "../../../../components/forum/section/SectionEditor.svelte";

    const title = "Редактировать раздел";

    export let id: number;
    export let name: string;
    export let order: number;

    let isAdmin = false;

    const action = async () => {
        const params: api.Forum.Section.Update.Request = {
            id: +id,
            name: name,
            order_index: order,
        };

        await api.Forum.Section.Update.exec(params);
        goto(route.Forum.Root);
    };
</script>

<SessionHub bind:isAdmin />

<Frame {title}>
    {#if !isAdmin}
        Доступ запрещён
    {:else}
        <SectionEditor bind:name bind:order {action} />
    {/if}
</Frame>
