<script lang="ts">
    import * as route from "route";

    export let category: any;
    export let isAdmin: boolean;
</script>

<style>
    .category {
        margin-top: 0.2em;
        margin-bottom: 0.2em;
        padding: 1em;
        border: 1px solid;
    }
</style>

<div class="category">
    {#if isAdmin}
        <a href={route.Forum.Category.Id(category.id)}>{category.name}</a>
    {:else}{category.name}{/if}
</div>
