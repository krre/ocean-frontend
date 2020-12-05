<script lang="ts">
    import Dialog from "../dialog/Dialog.svelte";
    import * as dialog from "dialog";

    export let onOk = (link: string) => {};
    let link: string;

    function pressOk() {
        onOk(link);
        dialog.close();
    }
</script>

<style>
</style>

<Dialog title="Добавление видео YouTube">
    <input bind:value={link} placeholder="Введите ссылку" />
    <div slot="buttons">
        <button on:click={pressOk}>ОК</button>
        <button on:click={() => dialog.close()}>Отменить</button>
    </div>
</Dialog>
