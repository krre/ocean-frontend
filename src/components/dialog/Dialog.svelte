<script lang="ts">
</script>

<style>
    .window-wrapper {
        position: relative;
        margin: 1em;
        max-height: 100%;
    }

    .window {
        position: relative;
        width: 40em;
        height: 10em;
        max-width: 100%;
        max-height: 100%;
        margin: 1em auto;
        background: white;
    }
</style>

<div class="window-wrapper">
    <div class="window" role="dialog" aria-modal="true">
        <slot />
    </div>
</div>
