<script lang="ts">
    export let post: string;

    function openLinkDialog() {}

    function openImageDialog() {}

    function openYouTubeDialog() {}
</script>

<style>
    .container {
        max-width: 100%;
        width: 50em;
        display: flex;
        flex-direction: column;
    }

    .toolbar {
        border-top: var(--border-1px);
        border-left: var(--border-1px);
        border-right: var(--border-1px);
        padding: 0.4em;
        background-color: rgb(236, 238, 255);
    }

    .area {
        margin-bottom: 0.5em;
    }

    button {
        margin-left: 0.3em;
    }
</style>

<div class="container">
    <div class="toolbar">
        <button on:click={openLinkDialog}><i class="fas fa-link" /></button>
        <button on:click={openImageDialog}><i class="fas fa-image" /></button>
        <button on:click={openYouTubeDialog}><i
                class="fab fa-youtube" /></button>
    </div>
    <textarea class="area" rows="10" bind:value={post} />
</div>
