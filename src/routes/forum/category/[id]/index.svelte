<script lang="ts">
    import * as route from "route";
    import * as method from "method";
    import { send } from "network";
    import { goto, stores } from "@sapper/app";
    import ForumPage from "../../../../components/forum/main/ForumPage.svelte";
    import Session from "../../../../components/Session.svelte";
    import SectionElement from "../../../../components/forum/section/SectionElement.svelte";
    import Navigator from "../../../../components/forum/main/Navigator.svelte";
    import Pagination from "../../../../components/Pagination.svelte";

    const { page } = stores();
    const categoryId = +$page.params.id;

    let categoryName: string;

    let isAdmin = false;
    let user;
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

    .line {
        border-top: var(--border-1px);
    }
</style>

<Session bind:user bind:isAdmin />
<Navigator />

<div><button on:click={append}>Добавить раздел</button></div>

<ForumPage title={categoryName}>
    {#each sections as section, row}
        <SectionElement {section} on:removed={() => load()} />

        {#if row < sections.length - 1}
            <div class="line" />
        {/if}
    {/each}
</ForumPage>
