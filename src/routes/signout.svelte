<script lang="ts">
    import * as api from "$lib/api";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { setToken } from "$lib/network";
    import { post } from "$lib/utils";

    async function signout() {
        await api.User.Logout.exec();
        await post("auth/logout");
        page.data.session.user = null;
        setToken("");
        goto("/");
    }

    signout();
</script>
