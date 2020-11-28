<script lang="ts">
    import * as route from "route";
    import * as method from "method";
    import { send } from "network";
    import { onMount } from "svelte";
    import { goto } from "@sapper/app";
    import ForumPage from "../../components/forum/main/ForumPage.svelte";
    import Session from "../../components/Session.svelte";
    import CategoryElement from "../../components/forum/category/CategoryElement.svelte";

    const title = "Форум";

    let isAdmin = false;
    let editable = false;
    let user;
    let categories = [];

    onMount(() => {
        load();
    });

    async function load() {
        const result = await send(method.Forum.GetAll);
        categories = [];

        for (let category of result.categories) {
            let sections = [];

            for (let section of result.sections) {
                if (section.category_id === category.id) {
                    sections.push(section);
                }
            }

            category.sections = sections;
            categories.push(category);
        }

        categories = categories;
    }

    function append() {
        goto(route.Forum.Category.Append);
    }
</script>

<style>
    .edit-btn {
        margin-right: var(--page-margin);
        display: flex;
        justify-content: flex-end;
    }

    .new {
        margin: 0.5em var(--page-margin);
    }
</style>

<Session bind:user bind:isAdmin />

<div class="new"><a href={route.Forum.New}>Новые сообщения</a></div>

<ForumPage {title} showHeader={false}>
    <div>
        {#each categories as category}
            <CategoryElement {category} {editable} on:removed={() => load()} />
        {/each}
    </div>

    <div>
        {#if editable}<button on:click={append}>Добавить категорию</button>{/if}
    </div>
</ForumPage>

{#if isAdmin}
    <div class="edit-btn">
        <button on:click={() => (editable = !editable)}>Редактировать</button>
    </div>
{/if}
