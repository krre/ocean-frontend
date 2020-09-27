<script lang="ts">
    import Nav from "../components/Nav.svelte";

    export let segment;
</script>

<style>
    main {
        padding: 0.5em;
    }
</style>

<Nav {segment} />

<main>
    <slot />
</main>
