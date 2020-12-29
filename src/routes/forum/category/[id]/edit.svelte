<script context="module" lang="ts">
    import { send } from "network";
    import type { Session, Page } from "types";
    import * as method from "method";

    export async function preload(page: Page, _session: Session) {
        const { id } = page.params;

        let result = await send(method.Forum.Category.GetOne, {
            id: Number(id),
        });
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
    import CategoryEditor from "../../../../components/forum/category/CategoryEditor.svelte";

    const title = "Редактировать категорию";
    let isAdmin = false;

    export let id: number;
    export let name: string;
    export let order: number;

    const action = async () => {
        const params = {
            id: +id,
            name: name,
            order_index: order,
        };

        await send(method.Forum.Category.Update, params);
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
