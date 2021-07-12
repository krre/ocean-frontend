<script lang="ts">
    import { errorMessage } from "network";
    import Loader from "./Loader.svelte";
    import OperationResult from "../components/OperationResult.svelte";

    export let title: string;
    export let enabled = true;
    export let sendAction = async () => {};

    let sending = false;
    let error: string;

    async function action() {
        let timerId = setTimeout(() => (sending = true), 200);
        enabled = false;

        try {
            await sendAction();
        } catch (e) {
            error = errorMessage(e);
        }

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

    <OperationResult {error} />
</div>
