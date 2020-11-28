<script lang="ts">
    import { send } from "network";
    import * as route from "route";
    import * as method from "method";
    import * as dialog from "dialog";
    import { goto } from "@sapper/app";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let section: any;
    export let editable = false;

    function editSection() {
        goto(route.Forum.Section.Edit(section.id));
    }

    async function removeSection() {
        if (!dialog.remove("Удалить секцию?")) return;

        const params = {
            id: +section.id,
        };
        await send(method.Forum.Section.Delete, params);
        dispatch("removed");
    }
</script>

<style>
    .section {
        padding: 1em;
        border-bottom: var(--border-1px);
    }

    .section:last-child {
        border-bottom: none;
    }

    .buttons {
        display: flex;
        justify-content: flex-end;
    }

    button {
        margin-right: 0.5em;
    }
</style>

<div class="section">
    <a href={route.Forum.Section.Id(section.id)}>{section.name}</a>
    {#if editable}
        <div class="buttons">
            <button on:click={editSection}>Изменить</button>
            <button on:click={removeSection}>Удалить</button>
        </div>
    {/if}
</div>
