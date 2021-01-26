<script lang="ts">
    import PostEditor from "../post/PostEditor.svelte";
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
    button {
        margin-right: 0.5em;
    }

    .row-btn {
        margin-top: 0.5em;
    }
</style>

<PostEditor bind:post={text} />

<div class="row-btn">
    <button on:click={send} disabled={!text}>Отправить</button>
    <button on:click={cancel}>Отменить</button>
</div>
