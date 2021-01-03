<script lang="ts">
    import Rectangle from "../../Rectangle.svelte";
    export let title = "";
</script>

<style>
</style>

<Rectangle>
    <div>{title}</div>
    <slot />
</Rectangle>
