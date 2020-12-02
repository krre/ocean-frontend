<script lang="ts">
    import { modalEnabled } from "stores";
</script>

<style>
    .bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
    }
</style>

{#if $modalEnabled}
    <div class="bg" />
{/if}
