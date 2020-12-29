<script lang="ts">
    import Frame from "../components/Frame.svelte";
    export let status;
    export let error;

    const dev = process.env.NODE_ENV === "development";
</script>

<style>
</style>

<Frame title={status}>
    <p>{error.message}</p>

    {#if dev && error.stack}
        <pre>{error.stack}</pre>
    {/if}
</Frame>
