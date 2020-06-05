<script>
    import * as utils from "utils.js";
    import ListEditor from "./ListEditor.svelte";

    export let title;
    export let description;
    export let images = [];
    export let videos = [];
    export let links = [];
    export let user;

    let userName = utils.sessionUserName(user);
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
    Изображения:
    <ListEditor bind:list={images} />
    Видео (только YouTube):
    <ListEditor bind:list={videos} />
    Ссылки:
    <ListEditor bind:list={links} />
    <div>Пользователь: {userName}</div>
</div>

<button class="append-item" on:click disabled={!title}>Отправить</button>
