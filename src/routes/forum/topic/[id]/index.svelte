<script lang="ts">
    import * as route from "route";
    import * as api from "api";
    import * as consts from "consts";
    import type { PathPart } from "forum";
    import type { User } from "types";
    import { sessionUserName } from "utils";
    import { stores } from "@sapper/app";
    import Rectangle from "../../../../components/Rectangle.svelte";
    import FramePage from "../../../../components/forum/main/ForumFrame.svelte";
    import SessionHub from "../../../../components/SessionHub.svelte";
    import PostElement from "../../../../components/forum/post/PostElement.svelte";
    import Navigator from "../../../../components/forum/main/Navigator.svelte";
    import Pagination from "../../../../components/Pagination.svelte";
    import PostEditor from "../../../../components/post/PostEditor.svelte";

    const { page } = stores();
    const topicId = +$page.params.id;

    interface EditedPost extends api.Forum.Post.GetAll.Post {
        edit: boolean;
    }

    let topicName: string;
    let topicUserId: number;
    let isAdmin = false;
    let user: User;
    let posts: EditedPost[] = [];
    let post: string;
    let postEditorRef: PostEditor;

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
        const params: api.Forum.Post.GetAll.Request = {
            topic_id: topicId,
            offset: (pageNo - 1) * pageLimit,
            limit: pageLimit,
        };

        const result = await api.Forum.Post.GetAll.exec(params);
        topicName = result.topic_name;
        topicUserId = result.topic_user_id;
        postCount = result.post_count;
        posts = result.posts as EditedPost[];

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
        const params: api.Forum.Post.Create.Request = {
            topic_id: topicId,
            post: post,
        };

        await api.Forum.Post.Create.exec(params);
        post = "";
        load();
    }

    function replyPost(row: number) {
        const post = posts[row];
        postEditorRef.appendReply(post.user_name, post.post);
    }
</script>

<style>
    button {
        margin-top: 0.5em;
    }
</style>

<SessionHub bind:user bind:isAdmin />
<Navigator category={categoryNav} section={sectionNav} />

<FramePage title={topicName} showContent={posts.length > 0}>
    {#each posts as post, i}
        <PostElement
            row={i}
            {post}
            {topicUserId}
            on:removed={() => load()}
            on:reply={(event) => replyPost(event.detail.row)}
        />
    {/each}
</FramePage>

<Pagination
    count={postCount}
    limit={pageLimit}
    offset={pageNo}
    baseRoute={route.Forum.Topic.Id(topicId)}
/>

<Rectangle padding={false} solid={false}>
    <PostEditor bind:post bind:this={postEditorRef} />
    <div>Пользователь: {sessionUserName(user)}</div>
    <div><button on:click={append} disabled={!post}>Отправить</button></div>
</Rectangle>
