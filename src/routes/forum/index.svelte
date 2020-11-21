<script lang="ts">
    import * as route from "route";
    import * as method from "method";
    import { send } from "network";
    import { onMount } from "svelte";
    import { goto } from "@sapper/app";
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
    .warn {
        color: white;
        background-color: red;
        text-align: center;
        padding: 0.5em 0;
    }

    .edit-btn {
        margin-bottom: 0.5em;
        display: flex;
        justify-content: flex-end;
    }

    .new {
        margin: 0.5em 0;
    }
</style>

<Session bind:user bind:isAdmin />

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="warn">Форум находится в разработке, но пользоваться уже можно</div>
<div class="new"><a href={route.Forum.New}>Новые сообщения</a></div>

{#if isAdmin}
    <div class="edit-btn">
        <button on:click={() => (editable = !editable)}>Редактировать</button>
    </div>
{/if}

{#each categories as category}
    <CategoryElement {category} {editable} on:removed={() => load()} />
{/each}

<div>
    {#if editable}<button on:click={append}>Добавить категорию</button>{/if}
</div>
