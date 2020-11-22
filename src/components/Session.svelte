<script lang="ts">
    import * as consts from "consts";
    import { stores } from "@sapper/app";

    const { session } = stores();

    export let user: any = null;
    export let isAdmin = false;
    export let isAnonym = true;

    $: isAdmin = user ? user.code === consts.Account.Admin : false;
    $: isAnonym = user ? user.code === consts.Account.Anonym : false;
    $: user = $session.user;
</script>
