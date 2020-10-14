<script lang="ts">
    import { onMount } from "svelte";
    import { send } from "network";
    import * as consts from "consts";

    onMount(async () => {
        users = await send("rating.getUsers");
    });

    let users = [];
</script>

<p>Количество мандел, добавленных пользователями.</p>

{#each users as user, i}
    {i + 1}.
    {user.name || consts.Account.ModeNames[consts.Account.Conspirator]}
    -
    {user.count}
    <br />
{/each}
