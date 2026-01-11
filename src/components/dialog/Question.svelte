<script lang="ts">
    import Dialog from "./Dialog.svelte";
    import * as dialog from "$lib/dialog";
    export let title: string;
    export let text: string;
</script>

<style>
</style>

<Dialog {title}>
    <div>{text}</div>
    <button slot="buttons" on:click={() => dialog.close()}>Закрыть</button>
</Dialog>
