<script lang="ts">
    import { send } from "network";
    import { goto, stores } from "@sapper/app";
    import * as method from "method";
    import * as route from "route";
    import Frame from "../../../../../components/Frame.svelte";
    import SessionHub from "../../../../../components/SessionHub.svelte";
    import SectionEditor from "../../../../../components/forum/section/SectionEditor.svelte";

    const { page } = stores();
    const title = "Добавить раздел";

    let isAdmin = false;
    let name: string;
    let order: number;

    const action = async () => {
        const params = {
            category_id: +$page.params.id,
            name: name,
            order_index: order,
        };

        await send(method.Forum.Section.Create, params);
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
