<script context="module" lang="ts">
    import * as api from "$lib/api";
    import type { Session, Page } from "$lib/types";

    export async function preload(_page: Page, _session: Session) {
        const getAllResponse = await api.Forum.GetAll.exec();

        return {
            getAllResponse,
        };
    }
</script>

<script lang="ts">
    import * as route from "$lib/route";
    import type { User } from "$lib/types";
    import { goto } from "$app/navigation";
    import FramePage from "../../components/forum/main/ForumFrame.svelte";
    import SessionHub from "../../components/SessionHub.svelte";
    import CategoryElement from "../../components/forum/category/CategoryElement.svelte";

    export let getAllResponse: api.Forum.GetAll.Response;

    let isAdmin = false;
    let editable = false;
    let user: User;
    let categories: api.Forum.GetAll.Category[] = [];

    $: {
        categories = [];

        for (let category of getAllResponse.categories) {
            let sections: api.Forum.GetAll.Section[] = [];

            for (let section of getAllResponse.sections) {
                if (section.category_id === category.id) {
                    sections.push(section);
                }
            }

            category.sections = sections;
            categories.push(category);
        }

        categories = categories;
    }

    async function reload() {
        getAllResponse = await api.Forum.GetAll.exec();
    }

    function append() {
        goto(route.Forum.Category.Append);
    }
</script>

<style>
    .new {
        margin: var(--page-margin) 0 0 var(--page-margin);
    }

    button {
        margin-left: 0.2em;
        color: gray;
    }
</style>

<SessionHub bind:user bind:isAdmin />

<div class="new"><a href={route.Forum.New}>Новые сообщения</a></div>

<FramePage title="Форум" showHeader={false}>
    <div>
        {#each categories as category}
            <CategoryElement
                {category}
                {editable}
                on:removed={() => reload()}
            />
        {/each}
    </div>
</FramePage>

{#if isAdmin}
    <div style="margin-left: 1em">
        {#if editable}<button on:click={append}
                ><i class="far fa-plus-square" /></button
            >{/if}
        <button on:click={() => (editable = !editable)}
            ><i class="fas fa-edit" /></button
        >
    </div>
{/if}
