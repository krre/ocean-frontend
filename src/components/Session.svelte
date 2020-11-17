<script lang="ts">
    import * as consts from "consts";
    import { stores } from "@sapper/app";

    const { session } = stores();

    export let user: any = null;
    export let isAdmin = false;
    export let isFierce = true;

    $: isAdmin = user ? user.code === consts.Account.Admin : false;
    $: isFierce = user ? user.code === consts.Account.Fierce : false;
    $: user = $session.user;
</script>
