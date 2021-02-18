<script lang="ts">
    import Loader from "./Loader.svelte";

    export let title: string;
    export let enabled = true;
    export let sendAction = async () => {};

    let sending = false;

    async function action() {
        let timerId = setTimeout(() => (sending = true), 200);
        enabled = false;
        await sendAction();
        clearTimeout(timerId);
        sending = false;
    }
</script>

<style>
    .container {
        display: flex;
        gap: 0.5em;
    }
</style>

<div class="container">
    <button on:click={action} disabled={!enabled}>{title}</button>

    {#if sending}
        <Loader scale={0.3} />
    {/if}
</div>
