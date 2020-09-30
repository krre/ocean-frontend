<script lang="ts">
    import { goto, stores } from "@sapper/app";
    import { post } from "utils";

    const { session } = stores();

    async function signout() {
        await post("auth/logout");
        $session.user = null;
        goto("/");
    }

    signout();
</script>
