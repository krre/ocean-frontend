<script lang="ts">
    import * as route from "route";
    import * as method from "method";
    import { send } from "network";
    import { goto, stores } from "@sapper/app";
    import Session from "../../../../components/Session.svelte";
    import TopicElement from "../../../../components/forum/topic/TopicElement.svelte";
    import Navigator from "../../../../components/forum/main/Navigator.svelte";
    import Pagination from "../../../../components/Pagination.svelte";

    const { page } = stores();
    const sectionId = +$page.params.id;

    let title: string;

    let isAdmin = false;
    let user;
    let topics = [];

    let pageNo = 1;
    let topicCount = 0;

    const pageLimit = 20;

    $: if (process.browser && $page.query) {
        pageNo = +$page.query.page || 1;
        load();
    }

    async function load() {
        const params = {
            section_id: sectionId,
            offset: (pageNo - 1) * pageLimit,
            limit: pageLimit,
        };

        const result = await send(method.Forum.Topic.GetAll, params);
        title = result.section_name;
        topics = result.topics;
        topicCount = result.topic_count;
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

<Pagination
    count={topicCount}
    limit={pageLimit}
    offset={pageNo}
    baseRoute={route.Forum.Section.Id(sectionId)} />
