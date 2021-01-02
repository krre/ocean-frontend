<script lang="ts">
    import * as route from "route";
    import * as dialog from "dialog";
    import * as api from "api";
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

        const params: api.Forum.Section.Delete.Request = {
            id: +section.id,
        };
        await api.Forum.Section.Delete.exec(params);
        dispatch("removed");
    }
</script>

<style>
    .section {
        padding: var(--page-padding);
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
