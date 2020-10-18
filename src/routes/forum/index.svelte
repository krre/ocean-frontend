<script lang="ts">
    import * as route from "route";
    import { goto, stores } from "@sapper/app";
    import Session from "../../components/Session.svelte";

    let isAdmin = false;

    function append() {
        goto(route.Forum.Category.Append);
    }
</script>

<svelte:head>
    <title>Форум</title>
</svelte:head>

<Session bind:isAdmin />

{#if isAdmin}<button on:click={append}>Добавить категорию</button>{/if}
