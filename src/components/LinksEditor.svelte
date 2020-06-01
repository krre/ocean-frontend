<script>
    export let links = [];

    function append() {
        links.push("");
        links = links;
    }

    function remove(index) {
        links.splice(index, 1);
        links = links;
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

{#each links as link, i}
    <div class="row">
        <input type="text" bind:value={links[i]} />
        <button on:click={() => remove(i)}>Удалить</button>
    </div>
{/each}
<button on:click={append}>Добавить</button>
