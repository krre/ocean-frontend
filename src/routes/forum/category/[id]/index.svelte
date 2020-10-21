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
    // export let id: number;
    export let name: string;

    function appendSection() {}

    function update() {}
</script>

{name}
<div>
    <button on:click={appendSection}> Добавить раздел </button>
    <button on:click={update}> Изменить </button>
</div>
