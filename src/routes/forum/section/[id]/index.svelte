<script lang="ts">
    import * as route from "route";
    import * as method from "method";
    import { send } from "network";
    import { onMount } from "svelte";
    import { goto, stores } from "@sapper/app";
    import Session from "../../../../components/Session.svelte";

    const { page } = stores();
    const sectionId = +$page.params.id;

    const title = "Темы";

    let isAdmin = false;
    let user;
    let topics = [];

    onMount(async () => {
        const params = {
            section_id: sectionId,
        };

        const result = await send(method.Forum.Topic.GetAll, params);
    });

    function append() {
        goto(route.Forum.Topic.Append(sectionId));
    }
</script>

<style>
    /* .category {
        margin-top: 0.2em;
        margin-bottom: 0.2em;
        padding: 1em;
        border: 1px solid;
    } */
</style>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<h1>{title}</h1>

<Session bind:user bind:isAdmin />

<!-- {#each sections as section}
    <div class="category">
        <a href={route.Forum.Section.Id(section.id)}>{section.name}</a>
    </div>
{/each} -->

<div><button on:click={append}>Добавить тему</button></div>
