<script lang="ts">
    import * as route from "route";
    import * as method from "method";
    import { send } from "network";
    import { onMount } from "svelte";
    import { goto } from "@sapper/app";
    import Session from "../../components/Session.svelte";

    const title = "Форум";

    let isAdmin = false;
    let user;
    let categories = [];

    onMount(async () => {
        const params: any = {};

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

<style>
    .category {
        margin-top: 0.2em;
        margin-bottom: 0.2em;
        padding: 1em;
        border: 1px solid;
    }
</style>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<h1>{title}</h1>

<Session bind:user bind:isAdmin />

{#each categories as category}
    <div class="category">
        {#if isAdmin}
            <a href={route.Forum.Category.Id(category.id)}>{category.name}</a>
        {:else}{category.name}{/if}
    </div>
{/each}

<div>
    {#if isAdmin}<button on:click={append}>Добавить категорию</button>{/if}
</div>
