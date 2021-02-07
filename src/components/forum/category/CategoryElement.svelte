<script lang="ts">
    import * as route from "route";
    import * as api from "api";
    import * as dialog from "dialog";
    import { goto } from "@sapper/app";
    import { createEventDispatcher } from "svelte";
    import SectionElement from "../section/SectionElement.svelte";

    const dispatch = createEventDispatcher();

    export let category: api.Forum.GetAll.Category;
    export let editable = false;

    function editCategory() {
        goto(route.Forum.Category.Edit(category.id));
    }

    async function removeCategory() {
        if (!dialog.remove("Удалить категорию?")) return;

        const params: api.Forum.Category.Delete.Request = {
            id: +category.id,
        };
        await api.Forum.Category.Delete.exec(params);
        dispatch("removed");
    }

    function appendSection() {
        goto(route.Forum.Section.Append(category.id));
    }
</script>

<style>
    .header {
        background-color: rgb(228, 237, 241);
        border-bottom: var(--border-1px);
    }

    h3 {
        padding-left: 1em;
        display: inline-block;
    }

    button {
        margin-left: 0.2em;
        color: gray;
    }
</style>

<div class="header">
    <h3>{category.name}</h3>
    {#if editable}
        <button on:click={appendSection}
            ><i class="far fa-plus-square" /></button
        >
        <button on:click={editCategory}><i class="fas fa-edit" /></button>
        <button on:click={removeCategory}><i class="fas fa-trash-alt" /></button
        >
    {/if}
</div>

{#each category.sections as section}
    <SectionElement {section} {editable} on:removed />
{/each}
