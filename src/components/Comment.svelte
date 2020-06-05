<script>
    import * as utils from "utils.js";
    export let user;
    let comments = [];
    let comment;
    let userName = utils.sessionUserName(user);

    function append() {
        console.log(comment);
        comment = "";
    }
</script>

<style>
    .area {
        width: 100%;
    }

    .send {
        margin-top: 10px;
    }
</style>

<div>Комментарии</div>
<br />

<textarea class="area" rows="10" bind:value={comment} />
<div>Пользователь: {userName}</div>
<button class="send" on:click={append} disabled={!comment}>Отправить</button>
