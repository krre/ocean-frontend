<script lang="ts">
    export let post: string;
</script>

<style>
    .area {
        max-width: 100%;
        width: 700px;
    }
</style>

<textarea class="area" rows="10" bind:value={post} />
