<script lang="ts">
    export let title: string;
    export let showHeader = true;
</script>

<style>
    .header {
        padding-left: calc(var(--page-padding) / 2);
        margin-left: 0;
    }

    .container {
        background-color: white;
        padding: 1em;
        margin: var(--page-margin);
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

<div class="container">
    <slot />
</div>
