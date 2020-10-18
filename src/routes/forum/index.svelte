<script lang="ts">
    import * as route from "route";
    import * as method from "method";
    import { send } from "network";
    import { onMount } from "svelte";
    import { goto } from "@sapper/app";
    import Session from "../../components/Session.svelte";

    let isAdmin = false;
    let user;
    let categories = [];

    onMount(async () => {
        const params = {};

        if (user) {
            params.user_id = user.id;
        }

        const result = await send(method.Forum.GetAll, params);
        categories = result.categories;
    });

    function append() {
        goto(route.Forum.Category.Append);
    }
</script>

<svelte:head>
    <title>Форум</title>
</svelte:head>

<Session bind:user bind:isAdmin />

<div>
    {#if isAdmin}<button on:click={append}>Добавить категорию</button>{/if}
</div>

{#each categories as category}
    <div>{category.name}</div>
{/each}
