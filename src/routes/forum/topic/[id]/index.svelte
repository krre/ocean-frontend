<script lang="ts">
    import * as route from "route";
    import * as method from "method";
    import * as consts from "consts";
    import type { PathPart } from "forum";
    import type { User } from "types";
    import { send } from "network";
    import { sessionUserName } from "utils";
    import { stores } from "@sapper/app";
    import FramePage from "../../../../components/forum/main/ForumFrame.svelte";
    import Session from "../../../../components/Session.svelte";
    import PostElement from "../../../../components/forum/post/PostElement.svelte";
    import Navigator from "../../../../components/forum/main/Navigator.svelte";
    import Pagination from "../../../../components/Pagination.svelte";
    import PostEditor from "../../../../components/post/PostEditor.svelte";

    const { page } = stores();
    const topicId = +$page.params.id;

    let topicName: string;
    let topicUserId: number;
    let isAdmin = false;
    let user: User;
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
        postCount = result.post_count;

        posts = [];

        for (let i = 0; i < result.posts.length; i++) {
            const post = result.posts[i];
            post.edit = false;
            posts.push(post);
        }

        posts = posts;

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

        await send(method.Forum.Post.Create, params);
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

    button {
        margin-top: 0.5em;
    }
</style>

<Session bind:user bind:isAdmin />
<Navigator category={categoryNav} section={sectionNav} />

<FramePage title={topicName}>
    {#each posts as post}
        <PostElement {post} {topicUserId} on:removed={() => load()} />
    {/each}
</FramePage>

<Pagination
    count={postCount}
    limit={pageLimit}
    offset={pageNo}
    baseRoute={route.Forum.Topic.Id(topicId)} />

<div class="send">
    <PostEditor bind:post />
    <div>Пользователь: {sessionUserName(user)}</div>
    <div><button on:click={append} disabled={!post}>Отправить</button></div>
</div>
