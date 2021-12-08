<script context="module" lang="ts">
    import * as api from "api";
    import type { Session, Page } from "types";

    export async function preload(page: Page, _session: Session) {
        const params: api.User.GetOne.Request = {
            id: +page.params.id,
        };

        const user = await api.User.GetOne.exec(params);
        return { user };
    }
</script>

<script lang="ts">
    import * as consts from "consts";
    import Frame from "../../../components/Frame.svelte";
    import Profile from "../../../components/Profile.svelte";

    export let user: api.User.GetOne.Response;
</script>

<style>
    .blocked {
        color: red;
        margin-top: 0;
    }

    .grid {
        display: grid;
        grid-template-columns: max-content auto;
        gap: 0.5em;
    }
</style>

<Frame title="Пользователь">
    {#if user.blocked}
        <h3 class="blocked">Акканут заблокирован!</h3>
    {/if}

    <div class="grid">
        <div>ИД:</div>
        <div>{user.id}</div>
        <div>Имя:</div>
        <div>{user.name}</div>
        <div>Пол:</div>
        <div>{consts.Genders[user.gender]}</div>

        <Profile {user} />
    </div>
</Frame>
