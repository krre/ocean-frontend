<script context="module" lang="ts">
    import * as api from "$lib/api";
    import type { Session, Page } from "$lib/types";

    export async function preload(page: Page, _session: Session) {
        const { id } = page.params;
        const params: api.Forum.Category.GetOne.Request = {
            id: Number(id),
        };

        const result = await api.Forum.Category.GetOne.exec(params);
        const name = result.name;
        const order = result.order_index;

        return { id, name, order };
    }
</script>

<script lang="ts">
    import { goto } from "$app/navigation";
    import * as route from "$lib/route";
    import Frame from "../../../../components/Frame.svelte";
    import SessionHub from "../../../../components/SessionHub.svelte";
    import CategoryEditor from "../../../../components/forum/category/CategoryEditor.svelte";

    const title = "Редактировать категорию";
    let isAdmin = false;

    export let id: number;
    export let name: string;
    export let order: number;

    const action = async () => {
        const params: api.Forum.Category.Update.Request = {
            id: +id,
            name: name,
            order_index: order,
        };

        await api.Forum.Category.Update.exec(params);
        goto(route.Forum.Root);
    };
</script>

<SessionHub bind:isAdmin />

<Frame {title}>
    {#if !isAdmin}
        Доступ запрещён
    {:else}
        <CategoryEditor bind:name bind:order {action} />
    {/if}
</Frame>
