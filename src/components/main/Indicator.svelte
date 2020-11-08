<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let title: string;
    export let count = 0;
    export let active = false;
    export let highlightNew = false;
</script>

<style>
    .cell {
        padding: 0.3em;
        border: 1px solid rgb(208, 208, 253);
        margin-right: 0.5em;
        cursor: pointer;
    }

    .active {
        background-color: rgb(166, 249, 255);
    }

    .hightlight {
        color: red;
    }
</style>

<span
    class="cell"
    class:active
    class:hightlight={highlightNew && count}
    on:click={() => dispatch('clicked')}>{title}:
    {count}</span>
