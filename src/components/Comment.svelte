<script>
    import * as utils from "utils.js";
    import { send } from "net.js";

    export let user;
    export let mandelaId;

    const limit = 50;

    let comments = [];
    let message;
    let userName = utils.sessionUserName(user);

    $: mandelaId && load();

    async function load() {
        const params = {
            mandela_id: Number(mandelaId),
            limit: limit,
            offset: 0
        };

        comments = await send("comment.getAll", params);
        console.log(comments);
    }

    async function append() {
        const params = {
            mandela_id: Number(mandelaId),
            user_id: user.id,
            message: message
        };

        await send("comment.create", params);
        message = "";
    }
</script>

<style>
    .area {
        width: 700px;
    }

    .send {
        margin-top: 10px;
    }
</style>

<div>Комментарии</div>
<br />

<textarea class="area" rows="10" bind:value={message} />
<div>Пользователь: {userName}</div>
<button class="send" on:click={append} disabled={!message}>Отправить</button>
