<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { formatDateTime } from "utils";
    import * as dialog from "dialog";

    const dispatch = createEventDispatcher();

    export let author: string;
    export let date: Date;
    export let row = 0;
    export let edited = false;

    function remove() {
        if (!dialog.remove("Удалить сообщение?")) return;

        dispatch("remove", {
            row: row,
        });
    }

    function edit() {
        dispatch("edit", {
            row: row,
        });
    }
</script>

<style>
    .title {
        color: gray;
        display: flex;
    }

    .edit-labels {
        display: block;
        color: lightblue;
    }

    .devider {
        margin: 0 0.5em;
    }

    .label-link {
        cursor: pointer;
    }
</style>

<div class="title">
    {author}<span class="devider">|</span>
    {formatDateTime(date)}
</div>

{#if edited}
    <div class="edit-labels">
        <span class="label-link" on:click={edit}> Редактировать </span>
        <span class="devider">|</span>
        <span class="label-link" on:click={remove}> Удалить </span>
    </div>
{/if}

<br />
