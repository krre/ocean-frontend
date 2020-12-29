<script context="module" lang="ts">
    import { send } from "network";
    import * as method from "method";

    export async function preload(page, _session) {
        const { id } = page.params;

        let result = await send(method.Forum.Section.GetOne, {
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
    import Page from "../../../../components/Page.svelte";
    import Session from "../../../../components/Session.svelte";
    import SectionEditor from "../../../../components/forum/section/SectionEditor.svelte";

    const title = "Редактировать раздел";

    export let id: number;
    export let name: string;
    export let order: number;

    let isAdmin = false;

    const action = async () => {
        const params = {
            id: +id,
            name: name,
            order_index: order,
        };

        await send(method.Forum.Section.Update, params);
        goto(route.Forum.Root);
    };
</script>

<Session bind:isAdmin />

<Page {title}>
    {#if !isAdmin}
        Доступ запрещён
    {:else}
        <SectionEditor bind:name bind:order {action} />
    {/if}
</Page>
