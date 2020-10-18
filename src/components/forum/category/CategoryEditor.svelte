<script lang="ts">
    export let name = "";
    export let order = 0;
    export let action = () => {};

    $: buttonEnabled = name && order;
</script>

<style>
    .form {
        display: grid;
        grid-gap: 0.5em;
        width: 20em;
    }

    button {
        margin-top: 1em;
    }
</style>

<div class="form">
    Название:
    <input type="text" bind:value={name} />
    Порядок:
    <input type="number" bind:value={order} />
</div>

<button on:click={action} disabled={!buttonEnabled}>Отправить</button>
