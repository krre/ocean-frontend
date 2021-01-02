<script lang="ts">
    import { goto } from "@sapper/app";
    import * as route from "route";
    import * as api from "api";
    import Frame from "../../../components/Frame.svelte";
    import SessionHub from "../../../components/SessionHub.svelte";
    import CategoryEditor from "../../../components/forum/category/CategoryEditor.svelte";

    const title = "Добавить категорию";

    let isAdmin = false;
    let name: string;
    let order: number;

    const action = async () => {
        const params: api.Forum.Category.Create.Request = {
            name: name,
            order_index: order,
        };

        await api.Forum.Category.Create.exec(params);
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
