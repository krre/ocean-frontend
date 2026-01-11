<script lang="ts">
    import { onMount } from "svelte";
    import type { Input } from "$lib/types";
    import Dialog from "../dialog/Dialog.svelte";
    import * as dialog from "$lib/dialog";

    onMount(() => {
        inputRef.focus();
    });

    export let onOk = (_link: string, _width?: number) => {};

    let link: string;
    let width: number;

    let inputRef: Input;

    function pressOk() {
        onOk(link, width);
        dialog.close();
    }
</script>

<style>
</style>

<Dialog title="Добавление изображения">
    <input
        bind:value={link}
        bind:this={inputRef}
        placeholder="Введите ссылку"
    />
    <input bind:value={width} placeholder="Введите ширину (не обязательно)" />
    <div slot="buttons">
        <button disabled={!link} on:click={pressOk}>ОК</button>
        <button on:click={() => dialog.close()}>Отменить</button>
    </div>
</Dialog>
