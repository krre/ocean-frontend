<script>
    import * as consts from "consts.js";
    import { formatDateTime, listUserName, sessionUserName } from "utils.js";
    import { send } from "net.js";
    import EditComment from "./EditComment.svelte";
    import RemoveComment from "./RemoveComment.svelte";

    export let user;
    export let mandelaId;

    let totalCount;
    const limit = 50;

    let comments = [];
    let message;
    let userName = sessionUserName(user);

    $: mandelaId && load();

    async function load() {
        const params = {
            mandela_id: Number(mandelaId),
            limit: limit,
            offset: 0
        };

        let result = await send("comment.getAll", params);
        totalCount = result.total_count;

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
            mandela_id: Number(mandelaId),
            user_id: user ? user.id : consts.FierceAccountId,
            message: message
        };

        await send("comment.create", params);
        message = "";
        load();
    }

    function showEdit(row) {
        comments[row].edit = true;
        comments[row].remove = false;
    }

    async function edit(row, message) {
        const params = {
            id: comments[row].id,
            message: message
        };

        await send("comment.update", params);
        comments[row].message = message;
        comments[row].edit = false;
    }

    function showRemove(row) {
        comments[row].remove = true;
        comments[row].edit = false;
    }
</script>

<style>
    .area {
        width: 700px;
    }

    .send {
        margin-top: 10px;
    }

    .message {
        white-space: pre-wrap;
    }

    .label-link {
        cursor: pointer;
    }
</style>

<div>Комментарии</div>
<br />

{#each comments as comment, i}
    <div>
        {formatDateTime(comment.create_ts)} | {listUserName(comment.user_name, comment.user_id)}
        {#if user && comment.user_id === user.id}
            <div>
                <label class="label-link" on:click={() => showEdit(i)}>
                    Редактировать
                </label>
                |
                <label class="label-link" on:click={() => showRemove(i)}>
                    Удалить
                </label>
            </div>
        {/if}
    </div>
    <div class="message">{comment.message}</div>

    {#if comment.edit}
        <p>
            <EditComment
                text={comment.message}
                on:send={event => edit(i, event.detail.text)}
                on:cancel={() => (comment.edit = false)} />
        </p>
    {/if}

    {#if comment.remove}
        <p>
            <RemoveComment on:cancel={() => (comment.remove = false)} />
        </p>
    {/if}
    <br />
{/each}

<textarea class="area" rows="10" bind:value={message} />
<div>Пользователь: {userName}</div>
<button class="send" on:click={append} disabled={!message}>Отправить</button>
