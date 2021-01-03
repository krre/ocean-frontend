<script lang="ts">
    import Rectangle from "./Rectangle.svelte";
    export let title: string;
    export let showHeader = true;
</script>

<style>
    .header {
        padding-left: calc(var(--page-padding) / 2);
        margin-left: 0;
    }
</style>

<svelte:head>
    <title>{title}</title>
</svelte:head>

{#if showHeader}
    <h1 class="header">{title}</h1>
{/if}

<Rectangle>
    <slot />
</Rectangle>
