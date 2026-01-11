<script lang="ts">
    import type { User } from "$lib/types";
    import * as consts from "$lib/consts";
    import * as utils from "$lib/utils";
    import MandelaTitle from "./MandelaTitle.svelte";
    import PostEditor from "./post/PostEditor.svelte";
    import WaitButton from "./WaitButton.svelte";

    export let titleMode = consts.Mandela.Title.Complex;
    export let title = "";
    export let what = "";
    export let before = "";
    export let after = "";
    export let description = "";
    export let categories = [];
    export let user: User;
    export let sendAction = async () => {};

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
        display: flex;
        gap: 0.5em;
        flex-direction: column;
    }

    .wait-button {
        margin-top: 0.5em;
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
        bind:mode={titleMode}
    />
    Описание:
    <PostEditor bind:post={description} />
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

<div class="wait-button">
    <WaitButton title="Отправить" enabled={buttonEnabled} {sendAction} />
</div>
