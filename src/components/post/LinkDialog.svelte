<script lang="ts">
    import Dialog from "../dialog/Dialog.svelte";
    import * as dialog from "dialog";

    export let onOk = (link: string, description?: string) => {};
    let link: string;
    let description: string;

    function pressOk() {
        onOk(link, description);
        dialog.close();
    }
</script>

<style>
</style>

<Dialog title="Добавление ссылки">
    <input bind:value={link} placeholder="Введите ссылку" />
    <input
        bind:value={description}
        placeholder="Введите описание (не обязательно)" />
    <div slot="buttons">
        <button on:click={pressOk}>ОК</button>
        <button on:click={() => dialog.close()}>Отменить</button>
    </div>
</Dialog>
