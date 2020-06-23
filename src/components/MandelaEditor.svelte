<script>
    import * as consts from "consts.js";
    import * as utils from "utils.js";
    import ListEditor from "./ListEditor.svelte";
    import MandelaTitle from "./MandelaTitle.svelte";

    export let titleMode = consts.SimpleTitle;
    export let title = "";
    export let what = "";
    export let before = "";
    export let after = "";
    export let description = "";
    export let images = [];
    export let videos = [];
    export let links = [];
    export let categories = [];
    export let user;

    let buttonEnabled;

    $: buttonEnabled =
        (titleMode === consts.SimpleTitle && title) ||
        (titleMode === consts.ComplexTitle && what && before && after);
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

    .category {
        display: inline;
    }
</style>

<div class="rules">
    <a href="help#rules">Рекомендуемые правила оформления мандел</a>
</div>

<div class="column">
    <MandelaTitle
        bind:title
        bind:what
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
    Категории:
    <div class="category">
        {#each consts.Categories as category, i}
            <label>
                <input type="checkbox" bind:group={categories} value={i} />
                {category}
            </label>
        {/each}
    </div>
    <div>Пользователь: {userName}</div>
</div>

<button class="append-item" on:click disabled={!buttonEnabled}>
    Отправить
</button>
