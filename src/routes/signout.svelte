<script lang="ts">
    import * as api from "api";
    import { goto, stores } from "@sapper/app";
    import { setToken } from "network";
    import { post } from "utils";

    const { session } = stores();

    async function signout() {
        await api.User.Logout.exec();
        await post("auth/logout");
        $session.user = null;
        setToken("");
        goto("/");
    }

    signout();
</script>
