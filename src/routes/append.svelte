<script>
    import * as sapper from "@sapper/app";
    import { Request } from "../js/json-rpc.js";
    import { sendRequest } from "../js/net.js";

    let title = "";
    let description = "";

    async function append() {
        if (!title) {
            alert("Заголовок не заполнен!");
            return;
        }

        if (!description) {
            alert("Описание не заполнено!");
            return;
        }

        const params = {
            title: title,
            description: description
        };

        const result = await sendRequest(new Request("topic.create", params));
        sapper.goto("/");
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

<button class="append-item" on:click={append}>Отправить</button>
