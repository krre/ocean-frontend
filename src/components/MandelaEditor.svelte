<script>
    import * as consts from "consts.js";
    import * as utils from "utils.js";
    import ListEditor from "./ListEditor.svelte";
    import MandelaTitle from "./MandelaTitle.svelte";

    export let titleMode = consts.SimpleTitle;
    export let title = "";
    export let where = "";
    export let before = "";
    export let after = "";
    export let description = "";
    export let images = [];
    export let videos = [];
    export let links = [];
    export let user;

    let buttonEnabled;

    $: buttonEnabled =
        (titleMode === consts.SimpleTitle && title) ||
        (titleMode === consts.ComplexTitle && where && before && after);
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

    .rules {
        margin-bottom: 10px;
    }
</style>

<div class="rules">
    <a href="help#rules">Рекомендуемые правила оформления мандел</a>
</div>

<div class="column">
    <MandelaTitle
        bind:title
        bind:where
        bind:before
        bind:after
        bind:mode={titleMode} />
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

<button class="append-item" on:click disabled={!buttonEnabled}>
    Отправить
</button>
