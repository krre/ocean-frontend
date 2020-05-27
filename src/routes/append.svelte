<script>
    import { goto, stores } from "@sapper/app";
    import { send } from "net.js";

    const { session } = stores();

    let title = "";
    let description = "";

    $: buttonEnabled = title && description;

    async function append() {
        const params = {
            title: title,
            description: description,
            user_id: $session.user.id
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
</div>

<button class="append-item" on:click={append} disabled={!buttonEnabled}>
    Отправить
</button>
