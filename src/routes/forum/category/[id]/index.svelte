<script lang="ts">
    import * as route from "route";
    import * as method from "method";
    import { send } from "network";
    import { goto, stores } from "@sapper/app";
    import Page from "../../../../components/Page.svelte";
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
</style>

<Session bind:user bind:isAdmin />
<Navigator />

<Page title={categoryName}>
    <div><button on:click={append}>Добавить раздел</button></div>
    {#each sections as section}
        <SectionElement {section} on:removed={() => load()} />
    {/each}
</Page>
