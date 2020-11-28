<script lang="ts">
    import * as route from "route";
    import * as method from "method";
    import * as consts from "consts";
    import type { PathPart } from "forum";
    import { send } from "network";
    import { sessionUserName } from "utils";
    import { stores } from "@sapper/app";
    import ForumPage from "../../../../components/forum/main/ForumPage.svelte";
    import Session from "../../../../components/Session.svelte";
    import PostElement from "../../../../components/forum/post/PostElement.svelte";
    import Navigator from "../../../../components/forum/main/Navigator.svelte";
    import Pagination from "../../../../components/Pagination.svelte";

    const { page } = stores();
    const topicId = +$page.params.id;

    let topicName: string;
    let topicUserId: number;
    let isAdmin = false;
    let user;
    let posts = [];
    let post: string;

    let pageNo = 1;
    let postCount = 0;

    const pageLimit = consts.Forum.Post.PageLimit;

    let categoryNav: PathPart;
    let sectionNav: PathPart;

    $: if (process.browser && $page.query) {
        pageNo = +$page.query.page || 1;
        load();
    }

    async function load() {
        const params = {
            topic_id: topicId,
            offset: (pageNo - 1) * pageLimit,
            limit: pageLimit,
        };

        const result = await send(method.Forum.Post.GetAll, params);
        topicName = result.topic_name;
        topicUserId = result.topic_user_id;
        posts = result.posts;
        postCount = result.post_count;

        categoryNav = {
            id: result.category_id,
            name: result.category_name,
        };

        sectionNav = {
            id: result.section_id,
            name: result.section_name,
        };
    }

    async function append() {
        const params = {
            topic_id: topicId,
            post: post,
        };

        const result = await send(method.Forum.Post.Create, params);
        post = "";
        load();
    }
</script>

<style>
    .send {
        margin: var(--page-margin);
    }

    @media screen and (max-width: 600px) {
        .send {
            margin: var(--page-margin) 0;
        }
    }

    .area {
        max-width: 100%;
        width: 700px;
    }

    button {
        margin-top: 0.5em;
    }
</style>

<Session bind:user bind:isAdmin />
<Navigator category={categoryNav} section={sectionNav} />

<ForumPage title={topicName}>
    {#each posts as post}
        <PostElement {post} {topicUserId} on:removed={() => load()} />
    {/each}
</ForumPage>

<Pagination
    count={postCount}
    limit={pageLimit}
    offset={pageNo}
    baseRoute={route.Forum.Topic.Id(topicId)} />

<div class="send">
    <textarea class="area" rows="10" bind:value={post} />
    <div>Пользователь: {sessionUserName(user)}</div>
    <div><button on:click={append} disabled={!post}>Отправить</button></div>
</div>
