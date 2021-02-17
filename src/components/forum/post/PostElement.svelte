<script lang="ts">
    import * as bbcode from "bbcode";
    import * as api from "api";
    import type { User } from "types";
    import { createEventDispatcher } from "svelte";
    import SessionHub from "../../SessionHub.svelte";
    import PostTitle from "../../../components/PostTitle.svelte";
    import EditComment from "../../../components/comment/EditComment.svelte";

    const dispatch = createEventDispatcher();

    interface EditedPost extends api.Forum.Post.GetAll.Post {
        edit: boolean;
    }

    export let topicUserId: number;
    export let post: EditedPost;
    export let editable = false;
    export let row = 0;
    export let id = 0;
    export let baseUrl = "";
    export let pageNo: number;

    let isAdmin = false;
    let isAnonym = true;
    let user: User;

    $: editable = isAdmin || (user && !isAnonym && user.id === post.user_id);
    $: removable =
        isAdmin ||
        (user &&
            !isAnonym &&
            (user.id == topicUserId || user.id === post.user_id));

    async function editPost(message: string) {
        const params: api.Forum.Post.Update.Request = {
            id: +post.id,
            post: message,
        };

        await api.Forum.Post.Update.exec(params);
        post.post = message;
        post.edit = false;
    }

    async function removePost() {
        const params: api.Forum.Post.Delete.Request = {
            id: +post.id,
        };
        await api.Forum.Post.Delete.exec(params);
        dispatch("removed");
    }
</script>

<style>
    .post {
        padding: var(--page-padding);
        border-bottom: var(--border-1px);
    }

    .post:last-child {
        border-bottom: none;
    }

    .text {
        white-space: pre-line;
        overflow-wrap: break-word;
        word-wrap: break-word;
    }
</style>

<SessionHub bind:user bind:isAdmin bind:isAnonym />

<div class="post">
    <PostTitle
        {id}
        {row}
        {baseUrl}
        {pageNo}
        userName={post.user_name}
        userId={post.user_id}
        date={post.create_ts}
        {editable}
        {removable}
        on:edit={() => (post.edit = true)}
        on:remove={() => removePost()}
        on:reply
    />

    {#if post.edit}
        <EditComment
            text={post.post}
            on:send={(event) => editPost(event.detail.text)}
            on:cancel={() => (post.edit = false)}
        />
    {:else}
        <div class="text">
            {@html bbcode.parse(post.post)}
        </div>
    {/if}
</div>
