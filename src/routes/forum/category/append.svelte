<script lang="ts">
    import { send } from "network";
    import { goto } from "@sapper/app";
    import * as method from "method";
    import * as route from "route";
    import Frame from "../../../components/Frame.svelte";
    import Session from "../../../components/Session.svelte";
    import CategoryEditor from "../../../components/forum/category/CategoryEditor.svelte";

    const title = "Добавить категорию";

    let isAdmin = false;
    let name: string;
    let order: number;

    const action = async () => {
        const params = {
            name: name,
            order_index: order,
        };

        await send(method.Forum.Category.Create, params);
        goto(route.Forum.Root);
    };
</script>

<Session bind:isAdmin />

<Frame {title}>
    {#if !isAdmin}
        Доступ запрещён
    {:else}
        <CategoryEditor bind:name bind:order {action} />
    {/if}
</Frame>
