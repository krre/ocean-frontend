<script lang="ts">
    export let success = "";
    export let error = "";

    $: if (success) {
        error = "";
    }
</script>

<style>
    .success {
        color: green;
    }

    .error {
        color: red;
    }
</style>

{#if success}
    <div class="success">{success}</div>
{/if}

{#if error}
    <div class="error">{error}</div>
{/if}
