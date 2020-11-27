<script lang="ts">
    import Page from "../components/Page.svelte";
    export let status;
    export let error;

    const dev = process.env.NODE_ENV === "development";
</script>

<style>
</style>

<Page title={status}>
    <p>{error.message}</p>

    {#if dev && error.stack}
        <pre>{error.stack}</pre>
    {/if}
</Page>
