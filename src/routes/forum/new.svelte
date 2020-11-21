<script lang="ts">
    import * as route from "route";
    import * as method from "method";
    import { send } from "network";
    import { stores } from "@sapper/app";
    import NewPost from "../../components/forum/main/NewPost.svelte";
    import Pagination from "../../components/Pagination.svelte";

    const { page } = stores();

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
            offset: (pageNo - 1) * pageLimit,
            limit: pageLimit,
        };

        const result = await send(method.Forum.GetNew, params);
        topics = result.topics;
        topicCount = result.topic_count;
    }
</script>

<style>
</style>

{#each topics as topic}
    <NewPost {topic} />
{/each}

<Pagination
    count={topicCount}
    limit={pageLimit}
    offset={pageNo}
    baseRoute={route.Forum.New} />
