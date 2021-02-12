<script lang="ts">
    import { userUrl } from "utils";
    import * as api from "api";

    export let pageNo = 1;
    export let pageLimit = 1;
    export let users: api.Rating.GetUsers.User[] = [];
</script>

<p>Количество мандел, добавленных пользователями.</p>

{#each users as user, i}
    {i + 1 + (pageNo - 1) * pageLimit}.
    {@html userUrl(user.name, user.id)}
    -
    {user.count}
    <br />
{/each}
