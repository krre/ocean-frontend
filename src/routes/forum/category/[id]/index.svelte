<script context="module" lang="ts">
    import { send } from "network";
    import * as method from "method";

    export async function preload(page, session) {
        const { id } = page.params;

        const params: any = {
            id: +id,
        };

        if (session.user) {
            params.user_id = session.user.id;
        }

        let result = await send(method.Forum.Category.GetOne, params);
        const name = result.name;

        return { id, name };
    }
</script>

<script lang="ts">
    import * as route from "route";
    import { goto } from "@sapper/app";

    export let id: number;
    export let name: string;

    function append() {
        goto(route.Forum.Section.Append(id));
    }

    function edit() {
        goto(route.Forum.Category.Edit(id));
    }

    async function remove() {
        const params = {
            id: +id,
        };
        await send(method.Forum.Category.Delete, params);
        goto(route.Forum.Root);
    }
</script>

{name}
<div>
    <button on:click={append}>Добавить раздел</button>
    <button on:click={edit}>Изменить</button>
    <button on:click={remove}>Удалить</button>
</div>
