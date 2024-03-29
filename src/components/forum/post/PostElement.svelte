<script lang="ts">
    import * as bbcode from "bbcode";
    import * as api from "api";
    import * as consts from "consts";
    import { LikeAction, LikeSelection } from "types";
    import { isAnonymAllowed } from "utils";
    import type { User } from "types";
    import { createEventDispatcher } from "svelte";
    import SessionHub from "../../SessionHub.svelte";
    import PostTitle from "../../../components/PostTitle.svelte";
    import EditComment from "../../../components/comment/EditComment.svelte";

    const dispatch = createEventDispatcher();

    interface EditedPost extends api.Forum.Post.GetAll.Post {
        edit: boolean;
    }

    export let post: EditedPost;
    export let editable = false;
    export let row = 0;
    export let id = 0;
    export let baseUrl = "";
    export let pageNo: number;

    let isAdmin = false;
    let isAnonym = true;
    let user: User;
    let likeUsers: api.Like.GetUsers.Response[];

    $: editable = isAdmin || (user && !isAnonym && user.id === post.user_id);
    $: removable = isAdmin || (user && !isAnonym && user.id === post.user_id);

    async function likePost(row: number, action: LikeAction) {
        if (action == LikeAction.Like || action == LikeAction.Dislike) {
            const params: api.Like.Create.Request = {
                post_id: +post.id,
                action: action,
            };

            await api.Like.Create.exec(params);

            post.like = action;

            if (action === LikeAction.Like) {
                post.like_count += 1;
            } else if (action === LikeAction.Dislike) {
                post.dislike_count += 1;
            }
        } else {
            const params: api.Like.Delete.Request = {
                post_id: +post.id,
            };

            await api.Like.Delete.exec(params);

            if (post.like === LikeAction.Like) {
                post.like_count -= 1;
            } else if (post.like === LikeAction.Dislike) {
                post.dislike_count -= 1;
            }

            post.like = null;
        }
    }

    async function getLikeUsers(row: number) {
        const params: api.Like.GetUsers.Request = {
            post_id: id,
        };

        likeUsers = await api.Like.GetUsers.exec(params);
    }

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
        likeSelection={!user ||
        post.user_id === user.id ||
        user.code === consts.Account.Anonym
            ? LikeSelection.Disabled
            : post.like == null
            ? LikeSelection.None
            : post.like == LikeAction.Like
            ? LikeSelection.Like
            : LikeSelection.Dislike}
        likeCount={post.like_count}
        dislikeCount={post.dislike_count}
        likeQuestion={isAdmin}
        {likeUsers}
        {editable}
        {removable}
        replyable={user !== undefined || isAnonymAllowed()}
        on:like={(event) => likePost(event.detail.row, event.detail.action)}
        on:getLikeUsers={(event) => getLikeUsers(event.detail.row)}
        on:edit={() => (post.edit = true)}
        on:remove={() => removePost()}
        on:reply
    />

    {#if post.edit}
        <EditComment
            text={post.post}
            sendAction={(text) => editPost(text)}
            on:cancel={() => (post.edit = false)}
        />
    {:else}
        <div class="text">
            {@html bbcode.parse(post.post)}
        </div>
    {/if}
</div>
