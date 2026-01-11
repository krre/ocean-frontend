<script context="module" lang="ts">
    import * as api from "$lib/api";
    import type { Session, Page } from "$lib/types";

    const PAGE_LIMIT = 20;

    export async function preload(page: Page, _session: Session) {
        const sectionId = +page.params.id;
        const pageNo = +page.query.page || 1;
        const getAllResponse = await load(sectionId, pageNo);
        return { getAllResponse, pageNo, sectionId };
    }

    async function load(
        sectionId: number,
        pageNo: number,
    ): Promise<api.Forum.Topic.GetAll.Response> {
        const params: api.Forum.Topic.GetAll.Request = {
            section_id: sectionId,
            offset: (pageNo - 1) * PAGE_LIMIT,
            limit: PAGE_LIMIT,
        };

        return api.Forum.Topic.GetAll.exec(params);
    }
</script>

<script lang="ts">
    import * as route from "$lib/route";
    import type { User } from "$lib/types";
    import { isAnonymAllowed } from "$lib/utils";
    import { goto } from "$app/navigation";
    import type { PathPart } from "$lib/forum";
    import FramePage from "../../../../components/forum/main/ForumFrame.svelte";
    import SessionHub from "../../../../components/SessionHub.svelte";
    import TopicElement from "../../../../components/forum/topic/TopicElement.svelte";
    import Navigator from "../../../../components/forum/main/Navigator.svelte";
    import Pagination from "../../../../components/Pagination.svelte";

    export let getAllResponse: api.Forum.Topic.GetAll.Response;
    export let sectionId = 0;
    export let pageNo = 1;

    let topics: api.Forum.Topic.GetAll.Topic[];
    let topicCount = 0;
    let sectionName: string;
    let categoryNav: PathPart;

    let isAdmin = false;
    let user: User;

    $: {
        sectionName = getAllResponse.section_name;
        topics = getAllResponse.topics;
        topicCount = getAllResponse.topic_count;

        categoryNav = {
            id: getAllResponse.category_id,
            name: getAllResponse.category_name,
        };
    }

    function append() {
        if (user || isAnonymAllowed()) {
            goto(route.Forum.Topic.Append(sectionId));
        }
    }

    async function reload() {
        getAllResponse = await load(sectionId, pageNo);
    }
</script>

<style>
</style>

<SessionHub bind:user bind:isAdmin />
<Navigator category={categoryNav} />

<FramePage title={sectionName}>
    <button slot="button" on:click={append}>Создать тему</button>

    {#each topics as topic}
        <TopicElement {topic} on:removed={() => reload()} />
    {/each}
</FramePage>

<Pagination
    count={topicCount}
    limit={PAGE_LIMIT}
    offset={pageNo}
    baseRoute={route.Forum.Section.Id(sectionId)}
/>
