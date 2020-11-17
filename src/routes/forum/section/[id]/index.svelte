<script lang="ts">
    import * as route from "route";
    import * as method from "method";
    import { send } from "network";
    import { onMount } from "svelte";
    import { goto, stores } from "@sapper/app";
    import Session from "../../../../components/Session.svelte";
    import TopicElement from "../../../../components/forum/topic/TopicElement.svelte";
    import Navigator from "../../../../components/forum/main/Navigator.svelte";

    const { page } = stores();
    const sectionId = +$page.params.id;

    let title: string;

    let isAdmin = false;
    let user;
    let topics = [];

    onMount(async () => {
        load();
    });

    async function load() {
        const params = {
            section_id: sectionId,
            offset: 0,
            limit: 1000,
        };

        const result = await send(method.Forum.Topic.GetAll, params);
        title = result.section_name;
        topics = result.topics;
    }

    function append() {
        goto(route.Forum.Topic.Append(sectionId));
    }
</script>

<style>
</style>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<Navigator />

<Session bind:user bind:isAdmin />

<div><button on:click={append}>Создать тему</button></div>
{#each topics as topic}
    <TopicElement {topic} on:removed={() => load()} />
{/each}
