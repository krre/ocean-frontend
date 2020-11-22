<script lang="ts">
    import MandelaRating from "../components/rating/MandelaRating.svelte";
    import UserRating from "../components/rating/UserRating.svelte";
    import * as consts from "consts";
    import * as route from "route";
    import { goto, stores } from "@sapper/app";

    const { page } = stores();
    const title = "Рейтинг";

    let type = consts.Rating.Mandela;

    class NonReactive {
        pageInit = false;

        setPageInit() {
            this.pageInit = true;
        }
    }

    const nonReactive = new NonReactive();

    $: if (nonReactive.pageInit && type >= consts.Rating.Mandela) {
        const params = new URLSearchParams();

        if (type) {
            params.append("type", type.toString());
        }

        const query = params.toString();
        const resQuery = route.Rating + (query ? "?" + query : "");
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
    <title>{title}</title>
</svelte:head>

<h1>{title}</h1>

<label>
    <input type="radio" bind:group={type} value={consts.Rating.Mandela} />
    Манделы
</label>

<label>
    <input type="radio" bind:group={type} value={consts.Rating.User} />
    Пользователи
</label>

<p />

{#if type === consts.Rating.Mandela}
    <MandelaRating />
{:else}
    <UserRating />
{/if}
