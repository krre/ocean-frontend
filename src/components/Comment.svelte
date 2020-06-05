<script>
    import * as utils from "utils.js";
    import { send } from "net.js";

    export let user;
    export let mandelaId;
    let messages = [];
    let message;
    let userName = utils.sessionUserName(user);

    async function load() {}

    async function append() {
        console.log(message);
        const params = {
            mandela_id: Number(mandelaId),
            user_id: user.id,
            message: message
        };

        console.log(params);

        const result = await send("comment.create", params);

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
