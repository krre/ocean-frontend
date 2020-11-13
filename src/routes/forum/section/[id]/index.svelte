<script lang="ts">
    import * as route from "route";
    import * as method from "method";
    import { send } from "network";
    import { onMount } from "svelte";
    import { goto, stores } from "@sapper/app";
    import Session from "../../../../components/Session.svelte";

    const { page } = stores();
    const sectionId = +$page.params.id;

    let title: string;

    let isAdmin = false;
    let user;
    let topics = [];

    onMount(async () => {
        const params = {
            section_id: sectionId,
            offset: 0,
            limit: 1000,
        };

        const result = await send(method.Forum.Topic.GetAll, params);
        title = result.section_name;
        topics = result.topics;
    });

    function append() {
        goto(route.Forum.Topic.Append(sectionId));
    }
</script>

<style>
    .topic {
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

<div><button on:click={append}>Создать тему</button></div>
{#each topics as topic}
    <div class="topic">
        <a href={route.Forum.Topic.Id(topic.id)}>{topic.name}</a>
    </div>
{/each}
