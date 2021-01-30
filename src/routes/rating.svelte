<script context="module" lang="ts">
    import * as api from "api";
    import type { Session, Page } from "types";
    import { MandelaVote } from "types";

    enum Type {
        Mandels,
        Users,
    }

    const PAGE_LIMIT = 50;

    export async function preload(page: Page, _session: Session) {
        const pageNo = +page.query.page || 1;
        const vote = +page.query.vote || MandelaVote.Yes;
        const type: Type = +page.query.type || Type.Mandels;

        let params = {
            limit: PAGE_LIMIT,
            offset: (pageNo - 1) * PAGE_LIMIT,
        };

        let getMandelsResponse: api.Rating.GetMandels.Response;
        let getUsersResponse: api.Rating.GetUsers.Response;

        if (type === Type.Mandels) {
            const par = params as api.Rating.GetMandels.Request;
            par.vote = vote;
            getMandelsResponse = await api.Rating.GetMandels.exec(par);
        } else {
            getUsersResponse = await api.Rating.GetUsers.exec(params);
        }

        return {
            getMandelsResponse,
            getUsersResponse,
            type,
            vote,
            pageNo,
        };
    }
</script>

<script lang="ts">
    import * as route from "route";
    import { goto } from "@sapper/app";
    import { onMount } from "svelte";
    import { Mounted } from "types";
    import Frame from "../components/Frame.svelte";
    import MandelaRating from "../components/rating/MandelaRating.svelte";
    import UserRating from "../components/rating/UserRating.svelte";
    import Pagination from "../components/Pagination.svelte";

    export let type = Type.Mandels;
    export let vote = MandelaVote.Yes;
    export let getMandelsResponse: api.Rating.GetMandels.Response;
    export let getUsersResponse: api.Rating.GetUsers.Response;
    export let pageNo = 1;

    let mounted = new Mounted();

    onMount(() => {
        mounted.setDone();
    });

    let baseQuery = new URLSearchParams();

    let mandels: api.Rating.GetMandels.Mandela[] = [];
    let mandelsCount = 0;

    let users: api.Rating.GetUsers.User[] = [];
    let usersCount = 0;

    $: if (getUsersResponse) {
        users = getUsersResponse.users;
        usersCount = getUsersResponse.user_count;
    }

    $: if (getMandelsResponse) {
        mandels = getMandelsResponse.mandels;
        mandelsCount = getMandelsResponse.total_count;
    }

    $: if (mounted.done()) {
        const params = new URLSearchParams();

        if (type == Type.Users) {
            params.append("type", type.toString());
        } else if (vote > MandelaVote.Yes) {
            params.append("vote", vote.toString());
        }

        baseQuery = params;

        const query = baseQuery.toString();
        goto(route.Rating + (query ? "?" + query : ""));
    }
</script>

<Frame title="Рейтинг">
    <label>
        <input type="radio" bind:group={type} value={Type.Mandels} />
        Манделы
    </label>

    <label>
        <input type="radio" bind:group={type} value={Type.Users} />
        Пользователи
    </label>

    <p />

    {#if type === Type.Mandels}
        <MandelaRating bind:vote {mandels} {pageNo} pageLimit={PAGE_LIMIT} />
    {:else}
        <UserRating {users} {pageNo} pageLimit={PAGE_LIMIT} />
    {/if}
</Frame>

<Pagination
    count={type === Type.Mandels ? mandelsCount : usersCount}
    limit={PAGE_LIMIT}
    offset={pageNo}
    baseRoute={route.Rating}
    {baseQuery}
/>
