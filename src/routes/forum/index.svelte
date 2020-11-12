<script lang="ts">
    import * as route from "route";
    import * as method from "method";
    import { send } from "network";
    import { onMount } from "svelte";
    import { goto } from "@sapper/app";
    import Session from "../../components/Session.svelte";
    import CategoryElement from "../../components/forum/main/CategoryElement.svelte";

    const title = "Форум";

    let isAdmin = false;
    let user;
    let categories = [];

    onMount(async () => {
        const params: any = {};

        if (user) {
            params.user_id = user.id;
        }

        const result = await send(method.Forum.GetAll, params);

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
    });

    function append() {
        goto(route.Forum.Category.Append);
    }
</script>

<style>
</style>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<h1>{title}</h1>

<Session bind:user bind:isAdmin />

{#each categories as category}
    <CategoryElement {category} {isAdmin} />
{/each}

<div>
    {#if isAdmin}<button on:click={append}>Добавить категорию</button>{/if}
</div>
