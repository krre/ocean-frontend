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
        gap: 0.5em;
        margin-bottom: 1em;
        align-items: center;
    }

    button {
        color: gray;
    }
</style>

<div class="title">
    {author}
    <span>|</span>
    {formatDateTime(date)}

    {#if edited}
        <button on:click={edit}><i class="fas fa-edit" /></button>
        <button on:click={remove}><i class="fas fa-trash-alt" /></button>
    {/if}
</div>
