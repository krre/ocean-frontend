<script lang="ts">
    import { stores } from "@sapper/app";
    import * as api from "api";
    import * as route from "route";
    import * as consts from "consts";
    import Pagination from "../Pagination.svelte";

    const { page } = stores();

    let pageNo = 1;
    let userCount = 0;
    let baseQuery = new URLSearchParams();
    const pageLimit = 30;

    let users: api.Rating.GetUsers.User[] = [];

    $: if (process.browser && $page.query) {
        pageNo = +$page.query.page || 1;

        baseQuery = new URLSearchParams();
        baseQuery.append("type", consts.Rating.User.toString());
        load();
    }

    async function load() {
        const params: api.Rating.GetUsers.Request = {
            limit: pageLimit,
            offset: (pageNo - 1) * pageLimit,
        };

        const result = await api.Rating.GetUsers.exec(params);
        users = result.users;
        userCount = result.user_count;
    }
</script>

<p>Количество мандел, добавленных пользователями.</p>

{#each users as user, i}
    {i + 1 + (pageNo - 1) * pageLimit}.
    {user.name}
    -
    {user.count}
    <br />
{/each}

<Pagination
    count={userCount}
    limit={pageLimit}
    offset={pageNo}
    {baseQuery}
    baseRoute={route.Rating} />
