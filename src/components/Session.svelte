<script lang="ts">
    import * as consts from "consts";
    import { stores } from "@sapper/app";

    const { session } = stores();

    export let user = null;
    export let isAdmin = false;

    $: isAdmin = user ? user.code === consts.Account.Admin : false;
    $: user = $session.user;
</script>
