<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { userUrl, dateUrl } from "utils";
    import * as dialog from "dialog";

    const dispatch = createEventDispatcher();

    export let baseUrl: string;
    export let pageNo: number;
    export let id: number;
    export let userName: string;
    export let userId: number;
    export let date: Date;
    export let row = 0;
    export let editable = false;
    export let removable = false;
    export let replyable = true;

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

    function reply() {
        dispatch("reply", {
            row: row,
        });
    }
</script>

<style>
    .title {
        color: gray;
        margin-bottom: 1em;
        align-items: center;
    }

    button {
        color: gray;
        margin-left: 0.2em;
    }
</style>

<div class="title">
    {@html userUrl(userName, userId)} · {@html dateUrl(
        baseUrl,
        date,
        id,
        pageNo
    )}

    {#if editable}
        <button on:click={edit}><i class="fas fa-edit" /></button>
    {/if}

    {#if removable}
        <button on:click={remove}><i class="fas fa-trash-alt" /></button>
    {/if}

    {#if replyable}
        <button on:click={reply}><i class="fas fa-reply" /></button>
    {/if}
</div>
