<script lang="ts">
    import * as route from "route";
    import * as method from "method";
    import { send } from "network";
    import type { User } from "types";
    import { goto, stores } from "@sapper/app";
    import FramePage from "../../../../components/forum/main/ForumFrame.svelte";
    import SessionHub from "../../../../components/SessionHub.svelte";
    import SectionElement from "../../../../components/forum/section/SectionElement.svelte";
    import Navigator from "../../../../components/forum/main/Navigator.svelte";

    const { page } = stores();
    const categoryId = +$page.params.id;

    let categoryName: string;

    let isAdmin = false;
    let user: User;
    let sections = [];

    $: if (process.browser) {
        load();
    }

    async function load() {
        const params = {
            category_id: categoryId,
        };

        const result = await send(method.Forum.Section.GetAll, params);
        categoryName = result.category_name;
        sections = result.sections;
    }

    function append() {
        goto(route.Forum.Section.Append(categoryId));
    }
</script>

<style>
    button {
        margin-left: var(--page-margin);
    }
</style>

<SessionHub bind:user bind:isAdmin />
<Navigator />

{#if isAdmin}
    <div><button on:click={append}>Добавить раздел</button></div>
{/if}

<FramePage title={categoryName}>
    {#each sections as section}
        <SectionElement {section} on:removed={() => load()} />
    {/each}
</FramePage>
