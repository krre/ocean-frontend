<script lang="ts">
    import * as consts from "consts";
    export let title = "";
    export let what = "";
    export let before = "";
    export let after = "";
    export let mode = consts.Mandela.Title.Simple;

    let selected;

    let modes = [
        {
            name: "Простой заголовок",
            current: mode === consts.Mandela.Title.Simple,
        },
        {
            name: "Сложный заголовок",
            current: mode === consts.Mandela.Title.Complex,
        },
    ];
</script>

<style>
    .mode {
        width: 150px;
    }
</style>

<select class="mode" bind:value={mode}>
    {#each modes as mode, i}
        <option value={i} selected={mode.current}>{mode.name}</option>
    {/each}
</select>

{#if mode == consts.Mandela.Title.Simple}
    <input bind:value={title} type="text" />
{:else}
    Что:
    <input bind:value={what} type="text" />
    Было:
    <input bind:value={before} type="text" />
    Стало:
    <input bind:value={after} type="text" />
{/if}
