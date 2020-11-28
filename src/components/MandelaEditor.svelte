<script lang="ts">
    import * as consts from "consts";
    import * as utils from "utils";
    import ListEditor from "./ListEditor.svelte";
    import MandelaTitle from "./MandelaTitle.svelte";
    import PostEditor from "./post/PostEditor.svelte";

    export let titleMode = consts.Mandela.Title.Simple;
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

    let buttonEnabled: boolean;

    $: buttonEnabled =
        (titleMode === consts.Mandela.Title.Simple && title.length > 0) ||
        (titleMode === consts.Mandela.Title.Complex &&
            what.length > 0 &&
            before.length > 0 &&
            after.length > 0);
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
    <PostEditor bind:post={description} />
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
