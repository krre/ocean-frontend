<script lang="ts">
    import * as consts from "consts";
    import type { User } from "types";
    import { stores } from "@sapper/app";

    const { session } = stores();

    export let user: User;
    export let isAdmin = false;
    export let isAnonym = true;

    $: user = $session.user as User;
    $: isAdmin = user ? user.code === consts.Account.Admin : false;
    $: isAnonym = user ? user.code === consts.Account.Anonym : false;
</script>
