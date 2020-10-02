<script lang="ts">
    export let list = [];

    function append() {
        list.push("");
        list = list;
    }

    function remove(index) {
        list.splice(index, 1);
        list = list;
    }
</script>

<style>
    button {
        width: fit-content;
    }

    input {
        flex-grow: 1;
        margin-right: 5px;
    }

    .row {
        display: flex;
        width: 100%;
    }
</style>

{#each list as link, i}
    <div class="row">
        <input type="text" bind:value={list[i]} />
        <button on:click={() => remove(i)}>Удалить</button>
    </div>
{/each}
<button on:click={append}>Добавить</button>
