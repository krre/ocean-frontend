<script lang="ts">
    import Menu from "./Menu.svelte";
    import Burger from "./Burger.svelte";
    import MediaQuery from "../MediaQuery.svelte";
</script>

<style>
    .bar {
        background-color: slateblue;
        height: 40px;
        /* padding: 1em; */
        box-shadow: 0 3px 8px 0px rgba(0, 0, 0, 0.45);
    }
</style>

<div class="bar">
    <MediaQuery query="(max-width: 768px)" let:matches>
        {#if matches}
            <Burger />
        {:else}
            <Menu />
        {/if}
    </MediaQuery>
</div>
