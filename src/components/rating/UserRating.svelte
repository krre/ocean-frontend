<script lang="ts">
    import { onMount } from "svelte";
    import { send } from "network";
    import * as consts from "consts";
    import * as method from "method";

    onMount(async () => {
        users = await send(method.Rating.GetUsers);
    });

    let users = [];
</script>

<p>Количество мандел, добавленных пользователями.</p>

{#each users as user, i}{i + 1}. {user.name} - {user.count} <br />{/each}
