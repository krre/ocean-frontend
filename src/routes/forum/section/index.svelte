<script lang="ts">
    import * as route from "route";
    import * as method from "method";
    import { send } from "network";
    import { onMount } from "svelte";
    import { goto } from "@sapper/app";
    import Session from "../../../components/Session.svelte";

    const title = "Секции";

    let isAdmin = false;
    let user;
    let sections = [];

    onMount(async () => {
        const params = {};

        if (user) {
            params.user_id = user.id;
        }

        const result = await send(method.Forum.Section.GetAll, params);
        sections = result.sections;
    });

    function append() {
        goto(route.Forum.Section.Append);
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

{#each sections as section}
    <div class="category">
        <a href={route.Forum.Section.Id(section.id)}>{section.name}</a>
    </div>
{/each}

<div>
    {#if isAdmin}<button on:click={append}>Добавить топик</button>{/if}
</div>
