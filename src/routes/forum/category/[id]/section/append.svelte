<script lang="ts">
    import * as route from "route";
    import * as api from "api";
    import { goto, stores } from "@sapper/app";
    import Frame from "../../../../../components/Frame.svelte";
    import SessionHub from "../../../../../components/SessionHub.svelte";
    import SectionEditor from "../../../../../components/forum/section/SectionEditor.svelte";

    const { page } = stores();
    const title = "Добавить раздел";

    let isAdmin = false;
    let name: string;
    let order: number;

    const action = async () => {
        const params: api.Forum.Section.Create.Request = {
            category_id: +$page.params.id,
            name: name,
            order_index: order,
        };

        await api.Forum.Section.Create.exec(params);
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
