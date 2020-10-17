<script lang="ts">
    import * as consts from "consts";
    import * as route from "route";
    import { goto, stores } from "@sapper/app";

    const { page, session } = stores();
    const user = $session.user;

    $: admin = user && user.code === consts.Account.Admin;

    function append() {
        console.log("append", route.Forum.Category.Append);
        goto(route.Forum.Category.Append);
    }
</script>

<svelte:head>
    <title>Форум</title>
</svelte:head>

{#if admin}<button on:click={append}>Добавить категорию</button>{/if}
