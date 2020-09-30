<script lang="ts">
    import * as consts from "consts";
    export let title = "";
    export let what = "";
    export let before = "";
    export let after = "";
    export let mode = consts.SimpleTitle;

    let selected;

    let modes = [
        { name: "Простой заголовок", current: mode === consts.SimpleTitle },
        { name: "Сложный заголовок", current: mode === consts.ComplexTitle }
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

{#if mode == consts.SimpleTitle}
    <input bind:value={title} type="text" />
{:else}
    Что:
    <input bind:value={what} type="text" />
    Было:
    <input bind:value={before} type="text" />
    Стало:
    <input bind:value={after} type="text" />
{/if}
