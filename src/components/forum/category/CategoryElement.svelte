<script lang="ts">
    import { send } from "network";
    import SectionElement from "../section/SectionElement.svelte";
    import * as route from "route";
    import * as method from "method";
    import * as dialog from "dialog";
    import { goto } from "@sapper/app";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let category: any;
    export let editable = false;

    function editCategory() {
        goto(route.Forum.Category.Edit(category.id));
    }

    async function removeCategory() {
        if (!dialog.remove("Удалить категорию?")) return;

        const params = {
            id: +category.id,
        };
        await send(method.Forum.Category.Delete, params);
        dispatch("removed");
    }

    function appendSection() {
        goto(route.Forum.Section.Append(category.id));
    }
</script>

<style>
    .category {
        margin-bottom: 0.7em;
        border: 1px solid;
    }

    .header {
        border-bottom: 1px solid;
        padding: 0.7em;
    }

    .sections {
        min-height: 1.5em;
    }

    .buttons {
        display: flex;
        justify-content: flex-end;
    }

    button {
        margin-right: 0.5em;
    }
</style>

<div class="category">
    <div class="header">
        {category.name}
        {#if editable}
            <div class="buttons">
                <button on:click={appendSection}>Добавить раздел</button>
                <button on:click={editCategory}>Изменить</button>
                <button on:click={removeCategory}>Удалить</button>
            </div>
        {/if}
    </div>

    <div class="sections">
        {#each category.sections as section}
            <SectionElement {section} {editable} on:removed />
        {/each}
    </div>
</div>
