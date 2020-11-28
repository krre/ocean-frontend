<script lang="ts">
    import { send } from "network";
    import * as method from "method";
    import * as consts from "consts";
    import { createEventDispatcher } from "svelte";
    import Session from "../../../components/Session.svelte";
    import PostTitle from "../../../components/PostTitle.svelte";
    import EditComment from "../../../components/comment/EditComment.svelte";

    const dispatch = createEventDispatcher();

    export let topicUserId: number;
    export let post: any;
    export let editable = false;

    let isAdmin = false;
    let isAnonym = true;
    let user;

    $: editable =
        isAdmin ||
        (user &&
            !isAnonym &&
            (user.id === post.user_id ||
                (user.id == topicUserId &&
                    post.user_id != consts.Account.Id.Admin)));

    async function editPost(message: string) {
        const params = {
            id: +post.id,
            post: message,
        };

        await send(method.Forum.Post.Update, params);
        post.post = message;
        post.edit = false;
    }

    async function removePost() {
        const params = {
            id: +post.id,
        };
        await send(method.Forum.Post.Delete, params);
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

<Session bind:user bind:isAdmin bind:isAnonym />

<div class="post">
    <PostTitle
        author={post.user_name}
        date={post.create_ts}
        edited={editable}
        on:edit={(event) => (post.edit = true)}
        on:remove={(event) => removePost()} />

    <div class="text">{post.post}</div>

    {#if post.edit}
        <EditComment
            text={post.post}
            on:send={(event) => editPost(event.detail.text)}
            on:cancel={() => (post.edit = false)} />
    {/if}
</div>
