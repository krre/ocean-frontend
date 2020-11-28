<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    export let text: string;

    function send() {
        dispatch("send", {
            text: text,
        });
    }

    function cancel() {
        dispatch("cancel");
    }
</script>

<style>
    .area {
        width: 600px;
        max-width: 100%;
        margin: 0.5em 0;
    }

    button {
        margin-right: 0.5em;
    }
</style>

<textarea class="area" rows="10" bind:value={text} />
<div>
    <button on:click={send}>Отправить</button>
    <button on:click={cancel}>Отменить</button>
</div>
