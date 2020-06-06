<script>
    import * as consts from "consts.js";
    import { formatDateTime, listUserName, sessionUserName } from "utils.js";
    import { send } from "net.js";

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
        comments = result.comments;
        totalCount = result.total_count;
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
</style>

<div>Комментарии</div>
<br />

{#each comments as comment}
    <div>
        {formatDateTime(comment.create_ts)} | {listUserName(comment.user_name, comment.user_id)}
    </div>
    <div class="message">{comment.message}</div>
    <br />
{/each}

<textarea class="area" rows="10" bind:value={message} />
<div>Пользователь: {userName}</div>
<button class="send" on:click={append} disabled={!message}>Отправить</button>
