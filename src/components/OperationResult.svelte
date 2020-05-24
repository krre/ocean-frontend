<script>
    export let success;
    export let error;

    $: if (success) {
        error = "";
    }
</script>

<style>
    .success {
        color: steelblue;
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
