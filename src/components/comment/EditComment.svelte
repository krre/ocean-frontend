<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    let message;

    function send() {
        dispatch("send", {
            message: message
        });
    }

    function cancel() {
        dispatch("cancel");
    }
</script>

<style>
    .area {
        width: 600px;
    }
</style>

<textarea class="area" rows="10" bind:value={message} />
<div>
    <button on:click={send}>Отправить</button>
    <button on:click={cancel}>Отменить</button>
</div>
