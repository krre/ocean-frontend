<script lang="ts">
    import * as consts from "$lib/consts";
    import type { User } from "$lib/types";
    import { page } from "$app/stores";

    export let user: User = null;
    export let userName: string;
    export let isAdmin = false;
    export let isAnonym = true;

    $: userName = user
        ? user.name
        : consts.Account.ModeNames[consts.Account.Anonym];
    $: user = $page.data.session?.user as User;
    $: isAdmin = user ? user.code === consts.Account.Admin : false;
    $: isAnonym = !user || user.code === consts.Account.Anonym;
</script>
