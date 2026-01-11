<script lang="ts">
    import { modalDialog } from "$lib/stores";
</script>

<style>
    .bg {
        position: fixed;
        z-index: 1000;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background: rgba(0, 0, 0, 0.6);
    }
</style>

{#if $modalDialog}
    <div class="bg">
        <svelte:component
            this={$modalDialog.component}
            {...$modalDialog.params}
        />
    </div>
{/if}
