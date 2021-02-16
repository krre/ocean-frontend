<script context="module" lang="ts">
    import * as api from "api";
    import type { Session, Page } from "types";

    const PAGE_LIMIT = 20;

    export async function preload(page: Page, session: Session) {
        const pageNo = +page.query.page || 1;

        const params: api.Forum.GetNew.Request = {
            offset: (pageNo - 1) * PAGE_LIMIT,
            limit: PAGE_LIMIT,
        };

        const getNewResponse = await api.Forum.GetNew.exec(params);

        return {
            getNewResponse,
            pageNo,
        };
    }
</script>

<script lang="ts">
    import * as route from "route";
    import FramePage from "../../components/forum/main/ForumFrame.svelte";
    import NewPost from "../../components/forum/main/NewPost.svelte";
    import Pagination from "../../components/Pagination.svelte";

    export let pageNo = 1;
    export let getNewResponse: api.Forum.GetNew.Response;

    $: topics = getNewResponse.topics;
    $: topicCount = getNewResponse.topic_count;
</script>

<style>
</style>

<FramePage title="Последние сообщения форума">
    {#each topics as topic}
        <NewPost {topic} />
    {/each}
</FramePage>

<Pagination
    count={topicCount}
    limit={PAGE_LIMIT}
    offset={pageNo}
    baseRoute={route.Forum.New}
/>
