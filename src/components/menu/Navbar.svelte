<script lang="ts">
    import Menu from "./Menu.svelte";
    import Burger from "./Burger.svelte";
    import MediaQuery from "../MediaQuery.svelte";

    export let sidebar = false;
</script>

<style>
    .bar {
        background-color: slateblue;
        height: 48px;
        box-shadow: 0 3px 8px 0px rgba(0, 0, 0, 0.45);
        display: flex;
        align-items: center;
    }
</style>

<div class="bar">
    <MediaQuery query="(max-width: 768px)" let:matches>
        {#if matches}
            <Burger bind:open={sidebar} />
        {:else}
            <Menu />
        {/if}
    </MediaQuery>
</div>
