<script lang="ts">
    import type { User } from "types";
    import { stores } from "@sapper/app";
    import * as consts from "consts";
    import * as route from "route";
    import * as bbcode from "bbcode";
    import * as api from "api";
    import Rectangle from "../Rectangle.svelte";
    import PostTitle from "../PostTitle.svelte";
    import MessageEditor from "../post/MessageEditor.svelte";
    import EditComment from "./EditComment.svelte";
    import Pagination from "../Pagination.svelte";

    const { page } = stores();

    interface EditedComment extends api.Comment.GetAll.Comment {
        edit: boolean;
        remove: boolean;
    }

    export let user: User;
    export let mandelaId: number;

    let pageNo = 1;
    let commentCount = 0;
    const pageLimit = 50;

    let comments: EditedComment[] = [];
    let message: string;
    let messageEditorRef: MessageEditor;

    $: if (process.browser && $page.query) {
        pageNo = +$page.query.page || 1;
        load();
    }

    async function load() {
        const params: api.Comment.GetAll.Request = {
            mandela_id: +mandelaId,
            limit: pageLimit,
            offset: (pageNo - 1) * pageLimit,
        };

        const result = await api.Comment.GetAll.exec(params);
        commentCount = result.total_count;
        comments = result.comments as EditedComment[];
    }

    async function append() {
        const params: api.Comment.Create.Request = {
            mandela_id: +mandelaId,
            message: message,
        };

        await api.Comment.Create.exec(params);
        load();
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
            <div class="post">
                <PostTitle
                    row={i}
                    author={comment.user_name}
                    date={comment.create_ts}
                    edited={user &&
                        (comment.user_id === user.id ||
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
        baseRoute={route.Mandela.Id(mandelaId)}
    />
{/if}

<MessageEditor
    bind:message
    bind:this={messageEditorRef}
    appendAction={() => append()}
/>
