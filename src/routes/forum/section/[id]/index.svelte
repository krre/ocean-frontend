<script lang="ts">
    import * as route from "route";
    import * as method from "method";
    import type { PathPart } from "forum";
    import { send } from "network";
    import { goto, stores } from "@sapper/app";
    import ForumPage from "../../../../components/forum/main/ForumPage.svelte";
    import Session from "../../../../components/Session.svelte";
    import TopicElement from "../../../../components/forum/topic/TopicElement.svelte";
    import Navigator from "../../../../components/forum/main/Navigator.svelte";
    import Pagination from "../../../../components/Pagination.svelte";

    const { page } = stores();
    const sectionId = +$page.params.id;

    let sectionName: string;

    let isAdmin = false;
    let user;
    let topics = [];

    let pageNo = 1;
    let topicCount = 0;

    let categoryNav: PathPart;

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
        sectionName = result.section_name;
        topics = result.topics;
        topicCount = result.topic_count;

        categoryNav = {
            id: result.category_id,
            name: result.category_name,
        };
    }

    function append() {
        goto(route.Forum.Topic.Append(sectionId));
    }
</script>

<style>
</style>

<Session bind:user bind:isAdmin />
<Navigator category={categoryNav} />

<ForumPage title={sectionName}>
    <button slot="button" on:click={append}>Создать тему</button>

    {#each topics as topic}
        <TopicElement {topic} on:removed={() => load()} />
    {/each}
</ForumPage>

<Pagination
    count={topicCount}
    limit={pageLimit}
    offset={pageNo}
    baseRoute={route.Forum.Section.Id(sectionId)} />
