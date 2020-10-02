<script lang="ts">
    import { onMount } from "svelte";
    import { send } from "network";
    import * as consts from "consts";

    onMount(async () => {
        load();
    });

    let users = [];

    async function load() {
        users = await send("rating.getUsers");
    }
</script>

<p>Количество мандел, добавленных пользователями.</p>

{#each users as user, i}
    {i + 1}. {user.name || consts.AccountModeNames[consts.ConspiratorAccount]} -
    {user.count}
    <br />
{/each}
