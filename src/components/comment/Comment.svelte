<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { User } from "types";
    import * as consts from "consts";
    import * as route from "route";
    import * as bbcode from "bbcode";
    import * as api from "api";
    import Rectangle from "../Rectangle.svelte";
    import PostTitle from "../PostTitle.svelte";
    import MessageEditor from "../post/MessageEditor.svelte";
    import EditComment from "./EditComment.svelte";
    import Pagination from "../Pagination.svelte";

    const dispatch = createEventDispatcher();

    interface EditedComment extends api.Comment.GetAll.Comment {
        edit?: boolean;
        remove?: boolean;
    }

    export let user: User;
    export let mandelaId: number;
    export let mandelaUserId: number;
    export let comments: EditedComment[] = [];
    export let pageNo = 1;
    export let commentCount = 0;
    export let pageLimit = 1;

    let message: string;
    let messageEditorRef: MessageEditor;

    $: baseRoute = route.Mandela.Id(mandelaId);

    async function append() {
        const params: api.Comment.Create.Request = {
            mandela_id: +mandelaId,
            message: message,
        };

        await api.Comment.Create.exec(params);
        dispatch("appended");
    }

    async function editComment(row: number, message: string) {
        const params: api.Comment.Update.Request = {
            id: +comments[row].id,
            message: message,
        };

        await api.Comment.Update.exec(params);
        comments[row].message = message;
        comments[row].edit = false;
    }

    async function deleteComment(row: number) {
        const params: api.Comment.Delete.Request = {
            id: comments[row].id,
        };

        await api.Comment.Delete.exec(params);
        comments[row].remove = false;
        comments.splice(row, 1);
    }

    function replyComment(row: number) {
        const comment = comments[row];
        messageEditorRef.appendReply(comment.user_name, comment.message);
    }
</script>

<style>
    .post {
        border-bottom: var(--border-1px);
        padding: var(--page-padding);
    }

    .post:last-child {
        border-bottom: none;
    }

    .message {
        white-space: pre-wrap;
        overflow-wrap: break-word;
        word-wrap: break-word;
    }
</style>

{#if comments.length}
    <Rectangle padding={false}>
        {#each comments as comment, i}
            <div class="post" id={comment.id.toString()}>
                <PostTitle
                    baseUrl={baseRoute}
                    {pageNo}
                    id={comment.id}
                    row={i}
                    userName={comment.user_name}
                    userId={comment.user_id}
                    date={comment.create_ts}
                    editable={user &&
                        (comment.user_id === user.id ||
                            user.id === consts.Account.Id.Admin)}
                    removable={user &&
                        (user.id === mandelaUserId ||
                            user.id === comment.user_id ||
                            user.id === consts.Account.Id.Admin)}
                    on:edit={(event) =>
                        (comments[event.detail.row].edit = true)}
                    on:remove={(event) => deleteComment(event.detail.row)}
                    on:reply={(event) => replyComment(event.detail.row)}
                />
                <div />

                {#if comment.edit}
                    <EditComment
                        text={comment.message}
                        on:send={(event) => editComment(i, event.detail.text)}
                        on:cancel={() => (comment.edit = false)}
                    />
                {:else}
                    <div class="message">
                        {@html bbcode.parse(comment.message)}
                    </div>
                {/if}
            </div>
        {/each}
    </Rectangle>

    <Pagination
        count={commentCount}
        limit={pageLimit}
        offset={pageNo}
        {baseRoute}
    />
{/if}

<MessageEditor
    bind:message
    bind:this={messageEditorRef}
    appendAction={() => append()}
/>
