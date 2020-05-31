<script>
    import * as consts from "consts.js";

    export let title;
    export let description;
    export let user;

    let userName;

    if (!user) {
        userName = consts.AccountModeNames[consts.FierceAccount];
    } else if (user.code !== consts.ConspiratorAccount) {
        userName = user.name;
    } else {
        userName = consts.AccountModeNames[consts.ConspiratorAccount];
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

<div class="column">
    Заголовок:
    <input bind:value={title} type="text" />
    Описание:
    <textarea rows="10" bind:value={description} />
    <div>Пользователь: {userName}</div>
</div>

<button class="append-item" on:click disabled={!title}>Отправить</button>
