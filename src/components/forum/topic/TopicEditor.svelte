<script lang="ts">
    export let name: string;
    export let action = () => {};

    $: buttonEnabled = name;
</script>

<style>
    .form {
        display: grid;
        grid-gap: 0.5em;
    }

    button {
        margin-top: 1em;
    }
</style>

<div class="form">Название: <input type="text" bind:value={name} /></div>
<button on:click={action} disabled={!buttonEnabled}>Отправить</button>
