<script lang="ts">
    import { onMount } from "svelte";
    import Dialog from "../dialog/Dialog.svelte";
    import * as dialog from "dialog";

    onMount(() => {
        focusRef.focus();
    });

    export let onOk = (_link: string) => {};

    let link: string;

    let focusRef;

    function pressOk() {
        onOk(link);
        dialog.close();
    }
</script>

<style>
</style>

<Dialog title="Добавление ссылки">
    <input
        bind:value={link}
        bind:this={focusRef}
        placeholder="Введите ссылку" />
    <div slot="buttons">
        <button on:click={pressOk}>ОК</button>
        <button on:click={() => dialog.close()}>Отменить</button>
    </div>
</Dialog>
