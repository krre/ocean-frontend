<script lang="ts">
    import Dialog from "../dialog/Dialog.svelte";
    import * as dialog from "dialog";

    export let onOk = (link: string, width?: number) => {};
    let link: string;
    let width: number;

    function pressOk() {
        onOk(link, width);
        dialog.close();
    }
</script>

<style>
</style>

<Dialog title="Добавление изображения">
    <input bind:value={link} placeholder="Введите ссылку" />
    <input bind:value={width} placeholder="Введите ширину (не обязательно)" />
    <div slot="buttons">
        <button on:click={pressOk}>ОК</button>
        <button on:click={() => dialog.close()}>Отменить</button>
    </div>
</Dialog>
