<script lang="ts">
    import MandelaRating from "../components/rating/MandelaRating.svelte";
    import UserRating from "../components/rating/UserRating.svelte";
    import { goto, stores } from "@sapper/app";

    const { page } = stores();
    let type = 0;

    class NonReactive {
        pageInit = false;

        setPageInit() {
            this.pageInit = true;
        }
    }

    const nonReactive = new NonReactive();

    $: if (nonReactive.pageInit && type >= 0) {
        const params = new URLSearchParams();

        if (type) {
            params.append("type", type.toString());
        }

        const query = params.toString();
        const resQuery = "rating" + (query ? "?" + query : "");
        goto(resQuery);
    }

    $: if (process.browser && $page.query) {
        assignQuery();
        nonReactive.setPageInit();
    }

    function assignQuery() {
        type = +$page.query.type || 0;
    }
</script>

<svelte:head>
    <title>Рейтинг</title>
</svelte:head>

<h1>Рейтинг</h1>

<label> <input type="radio" bind:group={type} value={0} /> Манделы </label>

<label> <input type="radio" bind:group={type} value={1} /> Пользователи </label>

<p />

{#if type === 0}
    <MandelaRating />
{:else}
    <UserRating />
{/if}
