<script context="module" lang="ts">
    import * as api from "api";
    import type { Session, Page } from "types";

    export async function preload(page: Page, _session: Session) {
        const categoryId = +page.params.id;
        const getAllResponse = await load(categoryId);
        return { getAllResponse, categoryId };
    }

    async function load(
        categoryId: number
    ): Promise<api.Forum.Section.GetAll.Response> {
        const params: api.Forum.Section.GetAll.Request = {
            category_id: categoryId,
        };

        return await api.Forum.Section.GetAll.exec(params);
    }
</script>

<script lang="ts">
    import * as route from "route";
    import type { User } from "types";
    import { goto } from "@sapper/app";
    import FramePage from "../../../../components/forum/main/ForumFrame.svelte";
    import SessionHub from "../../../../components/SessionHub.svelte";
    import SectionElement from "../../../../components/forum/section/SectionElement.svelte";
    import Navigator from "../../../../components/forum/main/Navigator.svelte";

    export let getAllResponse: api.Forum.Section.GetAll.Response;
    export let categoryId = 0;

    let categoryName: string;

    let isAdmin = false;
    let user: User;
    let sections: api.Forum.Section.GetAll.Section[] = [];

    $: {
        categoryName = getAllResponse.category_name;
        sections = getAllResponse.sections;
    }

    function append() {
        goto(route.Forum.Section.Append(categoryId));
    }

    async function reload() {
        getAllResponse = await load(categoryId);
    }
</script>

<style>
    button {
        margin-left: var(--page-margin);
        color: gray;
    }
</style>

<SessionHub bind:user bind:isAdmin />
<Navigator />

<FramePage title={categoryName}>
    {#each sections as section}
        <SectionElement {section} on:removed={() => reload()} />
    {/each}
</FramePage>

{#if isAdmin}
    <button on:click={append}><i class="far fa-plus-square" /></button>
{/if}
