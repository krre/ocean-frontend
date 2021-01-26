<script lang="ts">
    import * as consts from "consts";
    import type { User } from "types";
    import { stores } from "@sapper/app";

    const { session } = stores();

    export let user: User = null;
    export let userName: string;
    export let isAdmin = false;
    export let isAnonym = true;

    $: userName = user
        ? user.name
        : consts.Account.ModeNames[consts.Account.Anonym];
    $: user = $session.user as User;
    $: isAdmin = user ? user.code === consts.Account.Admin : false;
    $: isAnonym = !user || user.code === consts.Account.Anonym;
</script>
