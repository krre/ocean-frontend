<script lang="ts">
    import { send } from "network";
    import { formatDateTime } from "utils";
    import * as route from "route";
    import * as method from "method";
    import * as dialog from "dialog";
    import { goto } from "@sapper/app";
    import { createEventDispatcher } from "svelte";
    import Session from "../../../components/Session.svelte";

    const dispatch = createEventDispatcher();

    export let post: any;
    export let editable = false;

    let isAdmin = false;
    let isFierce = true;
    let user;

    $: editable = isAdmin || (user && user.id === post.user_id && !isFierce);

    function editPost() {
        goto(route.Forum.Post.Edit(post.id));
    }

    async function removePost() {
        if (!dialog.remove("Удалить сообщение?")) return;

        const params = {
            id: +post.id,
        };
        await send(method.Forum.Post.Delete, params);
        dispatch("removed");
    }
</script>

<style>
    .post {
        margin: 0.5em 0;
        padding: 1em;
        border: 1px solid;
        white-space: pre-line;
    }

    .buttons {
        display: flex;
        justify-content: flex-end;
        margin-top: 0.5em;
    }

    button {
        margin-right: 0.5em;
    }
</style>

<Session bind:user bind:isAdmin bind:isFierce />

<div class="post">
    <div>{post.user_name} | {formatDateTime(post.create_ts)}</div>
    <br />
    {post.post}
    {#if editable}
        <div class="buttons">
            <button on:click={editPost}>Изменить</button>
            <button on:click={removePost}>Удалить</button>
        </div>
    {/if}
</div>
