<script lang="ts">
    import { sessionUserName } from "utils";
    import { send } from "network";
    import { stores } from "@sapper/app";
    import * as consts from "consts";
    import * as method from "method";
    import * as route from "route";
    import PostTitle from "../PostTitle.svelte";
    import EditComment from "./EditComment.svelte";
    import RemoveComment from "./RemoveComment.svelte";
    import Pagination from "../Pagination.svelte";

    const { page } = stores();

    export let user;
    export let mandelaId: number;

    let pageNo = 1;
    let commentCount = 0;
    const pageLimit = 50;

    let comments = [];
    let message: string;
    let userName = sessionUserName(user);

    $: if (process.browser && $page.query) {
        pageNo = +$page.query.page || 1;
        load();
    }

    async function load() {
        const params = {
            mandela_id: +mandelaId,
            limit: pageLimit,
            offset: (pageNo - 1) * pageLimit,
        };

        let result = await send(method.Comment.GetAll, params);
        commentCount = result.total_count;

        comments = [];

        for (let i = 0; i < result.comments.length; i++) {
            const comment = result.comments[i];
            comment.edit = false;
            comment.remove = false;
            comments.push(comment);
        }
    }

    async function append() {
        const params = {
            mandela_id: +mandelaId,
            message: message,
        };

        await send(method.Comment.Create, params);
        message = "";
        load();
    }

    function showEdit(row: number) {
        comments[row].edit = true;
        comments[row].remove = false;
    }

    async function edit(row: number, message: string) {
        const params = {
            id: +comments[row].id,
            message: message,
        };

        await send(method.Comment.Update, params);
        comments[row].message = message;
        comments[row].edit = false;
    }

    function showRemove(row: number) {
        comments[row].remove = true;
        comments[row].edit = false;
    }

    async function deleteComment(row: number) {
        const params = {
            id: comments[row].id,
        };

        await send(method.Comment.Delete, params);
        comments[row].remove = false;
        comments.splice(row, 1);
    }
</script>

<style>
    .area {
        max-width: 100%;
        width: 700px;
    }

    .send {
        margin-top: 10px;
    }

    .message {
        white-space: pre-wrap;
        overflow-wrap: break-word;
        word-wrap: break-word;
    }

    .label-link {
        cursor: pointer;
    }
</style>

<div>Комментарии</div>
<br />

{#each comments as comment, i}
    <PostTitle author={comment.user_name} date={comment.create_ts} />
    <div>
        {#if user && (comment.user_id === user.id || user.id === consts.Account.Id.Admin)}
            <div>
                <span class="label-link" on:click={() => showEdit(i)}>
                    Редактировать
                </span>
                |
                <span class="label-link" on:click={() => showRemove(i)}>
                    Удалить
                </span>
            </div>
        {/if}
    </div>
    <div class="message">{comment.message}</div>

    {#if comment.edit}
        <p>
            <EditComment
                text={comment.message}
                on:send={(event) => edit(i, event.detail.text)}
                on:cancel={() => (comment.edit = false)} />
        </p>
    {/if}

    {#if comment.remove}
        <p>
            <RemoveComment
                on:confirm={() => deleteComment(i)}
                on:cancel={() => (comment.remove = false)} />
        </p>
    {/if}
    <br />
{/each}

<Pagination
    count={commentCount}
    limit={pageLimit}
    offset={pageNo}
    baseRoute={route.Mandela.Id(mandelaId)} />

<textarea class="area" rows="10" bind:value={message} />
<div>Пользователь: {userName}</div>
<button class="send" on:click={append} disabled={!message}>Отправить</button>
