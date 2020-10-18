<script lang="ts">
    import "../../../../components/Session.svelte";
    import Session from "../../../../components/Session.svelte";
    import CategoryEditor from "../../../../components/forum/category/CategoryEditor.svelte";

    const title = "Редактировать категорию";
    let isAdmin = false;
    let name: string;
    let order: number;

    const action = () => {};
</script>

<Session bind:isAdmin />

<svelte:head>
    <title>{title}</title>
</svelte:head>
<h1>{title}</h1>

{#if !isAdmin}
    Доступ запрещён
{:else}
    <CategoryEditor bind:name bind:order {action} />
{/if}
