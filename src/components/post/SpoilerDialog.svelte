<script lang="ts">
    import { onMount } from "svelte";
    import type { Input } from "types";
    import Dialog from "../dialog/Dialog.svelte";
    import * as dialog from "dialog";

    onMount(() => {
        inputRef.focus();
    });

    export let onOk = (_description: string) => {};

    let description = "Спойлер";

    let inputRef: Input;

    function pressOk() {
        onOk(description);
        dialog.close();
    }
</script>

<style>
</style>

<Dialog title="Добавление спойлера">
    <input
        bind:value={description}
        bind:this={inputRef}
        placeholder="Введите описание"
    />
    <div slot="buttons">
        <button disabled={!description} on:click={pressOk}>ОК</button>
        <button on:click={() => dialog.close()}>Отменить</button>
    </div>
</Dialog>
