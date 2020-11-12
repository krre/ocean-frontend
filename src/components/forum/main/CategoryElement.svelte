<script lang="ts">
    import SectionElement from "./SectionElement.svelte";
    import * as route from "route";

    export let category: any;
    export let isAdmin: boolean;
</script>

<style>
    .category {
        margin: 0.2em 0;
        border: 1px solid;
    }

    .header {
        border-bottom: 1px solid;
        padding: 0.7em;
    }
</style>

<div class="category">
    <div class="header">
        {#if isAdmin}
            <a href={route.Forum.Category.Id(category.id)}>{category.name}</a>
        {:else}{category.name}{/if}
    </div>

    {#each category.sections as section}
        <SectionElement {section} />
    {/each}
</div>
