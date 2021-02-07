<script lang="ts">
    import * as route from "route";
    import * as dialog from "dialog";
    import * as api from "api";
    import { goto } from "@sapper/app";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let section: api.Forum.Section.GetAll.Section;
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

    .info {
        margin-top: 0.5em;
        color: rgb(90, 90, 90);
    }

    button {
        margin-left: 0.5em;
        color: gray;
    }
</style>

<div class="section">
    <a href={route.Forum.Section.Id(section.id)}>{section.name}</a>
    {#if editable}
        <button on:click={editSection}><i class="fas fa-edit" /></button>
        <button on:click={removeSection}><i class="fas fa-trash-alt" /></button>
    {/if}
    <div class="info">
        Тем: {section.topic_count} Постов: {section.post_count}
    </div>
</div>
