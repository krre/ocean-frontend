<script lang="ts">
    import { send } from "network";
    import * as route from "route";
    import * as method from "method";
    import * as dialog from "dialog";
    import * as consts from "consts";
    import { goto } from "@sapper/app";
    import { createEventDispatcher } from "svelte";
    import Session from "../../../components/Session.svelte";
    import PostTitle from "../../../components/PostTitle.svelte";

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

    function editPost() {
        goto(route.Forum.Post.Edit(post.id));
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
        white-space: pre-line;
        overflow-wrap: break-word;
        word-wrap: break-word;
    }

    .post:last-child {
        border-bottom: none;
    }
</style>

<Session bind:user bind:isAdmin bind:isAnonym />

<div class="post">
    <PostTitle
        author={post.user_name}
        date={post.create_ts}
        edited={editable}
        on:edit={(event) => editPost()}
        on:remove={(event) => removePost()} />
    {post.post}
</div>
