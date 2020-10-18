<script lang="ts">
    import * as consts from "consts";
    import { stores } from "@sapper/app";

    const { session } = stores();
    export const user = $session.user;
    export let isAdmin = false;
    $: isAdmin = user && user.code === consts.Account.Admin;
</script>
