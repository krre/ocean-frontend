<script lang="ts">
    import * as route from "route";
    import * as api from "api";
    import { stores } from "@sapper/app";
    import FramePage from "../../components/forum/main/ForumFrame.svelte";
    import NewPost from "../../components/forum/main/NewPost.svelte";
    import Pagination from "../../components/Pagination.svelte";

    const { page } = stores();
    const title = "Последние сообщения форума";

    let topics: api.Forum.GetNew.Topic[] = [];

    let pageNo = 1;
    let topicCount = 0;

    const pageLimit = 20;

    $: if (process.browser && $page.query) {
        pageNo = +$page.query.page || 1;
        load();
    }

    async function load() {
        const params: api.Forum.GetNew.Request = {
            offset: (pageNo - 1) * pageLimit,
            limit: pageLimit,
        };

        const result = await api.Forum.GetNew.exec(params);
        topics = result.topics;
        topicCount = result.topic_count;
    }
</script>

<style>
</style>

<FramePage {title}>
    {#each topics as topic}
        <NewPost {topic} replyed={false} />
    {/each}
</FramePage>

<Pagination
    count={topicCount}
    limit={pageLimit}
    offset={pageNo}
    baseRoute={route.Forum.New} />
