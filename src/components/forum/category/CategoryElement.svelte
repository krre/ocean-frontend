<script lang="ts">
    import * as route from "route";
    import * as api from "api";
    import * as dialog from "dialog";
    import { goto } from "@sapper/app";
    import { createEventDispatcher } from "svelte";
    import SectionElement from "../section/SectionElement.svelte";

    const dispatch = createEventDispatcher();

    export let category: any;
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
        padding: 1em;
        margin: 0;
    }

    .buttons {
        display: flex;
        justify-content: flex-end;
    }

    button {
        margin-right: 0.5em;
    }
</style>

<div class="header">
    <h3>{category.name}</h3>
    {#if editable}
        <div class="buttons">
            <button on:click={appendSection}>Добавить раздел</button>
            <button on:click={editCategory}>Изменить</button>
            <button on:click={removeCategory}>Удалить</button>
        </div>
    {/if}
</div>

{#each category.sections as section}
    <SectionElement {section} {editable} on:removed />
{/each}
