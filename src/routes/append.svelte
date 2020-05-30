<script>
    import * as consts from "consts.js";
    import { goto, stores } from "@sapper/app";
    import { send } from "net.js";

    const { session } = stores();

    let title = "";
    let description = "";

    let userName;

    if (!$session.user) {
        userName = consts.AccountModeNames[consts.FierceAccount];
    } else if ($session.user.code === consts.UserAccount) {
        userName = $session.user.name;
    } else {
        userName = consts.AccountModeNames[$session.user.code];
    }

    $: buttonEnabled = title && description;

    async function append() {
        const params = {
            title: title,
            description: description,
            user_id: $session.user ? $session.user.id : consts.FierceAccountId
        };

        await send("topic.create", params);
        goto("/");
    }
</script>

<style>
    .column {
        display: grid;
        grid-gap: 10px;
    }

    .append-item {
        margin-top: 10px;
    }
</style>

<svelte:head>
    <title>Добавить манделу</title>
</svelte:head>
<h1>Добавить манделу</h1>

<div class="column">
    Заголовок:
    <input bind:value={title} type="text" />
    Описание:
    <textarea rows="10" bind:value={description} />
    <div>Пользователь: {userName}</div>
</div>

<button class="append-item" on:click={append} disabled={!buttonEnabled}>
    Отправить
</button>
