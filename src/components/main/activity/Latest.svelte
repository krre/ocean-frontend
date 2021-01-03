<script lang="ts">
    import Rectangle from "../../Rectangle.svelte";
    export let title = "";
    export let link = "#";
</script>

<style>
    .title {
        margin-bottom: var(--page-margin);
    }
</style>

<Rectangle>
    <div class="title"><a href={link}>{title}</a></div>
    <slot />
</Rectangle>
