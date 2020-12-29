<script lang="ts">
    export let title: string;
    export let showHeader = true;
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

    .container {
        background-color: white;
        margin: var(--page-margin);
        border: var(--border-1px);
    }

    @media screen and (max-width: 600px) {
        .container {
            margin: var(--page-margin) 0;
        }
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

<div class="container">
    <slot />
</div>
