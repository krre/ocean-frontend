<script lang="ts">
    import Rectangle from "../../Rectangle.svelte";
    export let title: string;
    export let showHeader = true;
    export let showPoll = false;
    export let showContent = true;
</script>

<style>
    .header {
        padding-left: calc(var(--page-padding) / 2);
        margin-left: 0;
    }

    .btn {
        margin-right: var(--page-margin);
        display: flex;
        justify-content: flex-end;
    }
</style>

<svelte:head>
    <title>{title}</title>
</svelte:head>

{#if showHeader}
    <h1 class="header">{title}</h1>
{/if}

<div class="btn">
    <slot name="button" />
</div>

{#if showPoll}
    <Rectangle>
        <slot name="poll" />
    </Rectangle>
{/if}

{#if showContent}
    <Rectangle padding={false}>
        <slot />
    </Rectangle>
{/if}
