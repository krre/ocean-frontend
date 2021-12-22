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
    import SessionHub from "../../../components/SessionHub.svelte";

    export let user: api.User.GetOne.Response;
    let isAdmin = false;

    async function updateUser() {
        const params: api.User.Update.Request = {
            id: user.id,
            name: user.name,
            code: user.code,
            gender: user.gender,
            blocked: user.blocked,
        };

        await api.User.Update.exec(params);
    }
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

<SessionHub bind:isAdmin />

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

    {#if isAdmin && user.code === consts.Account.User}
        <br />
        <label>
            <input
                type="checkbox"
                bind:checked={user.blocked}
                on:change={(_) => updateUser()}
            />
            Заблокировано
        </label>
    {/if}
</Frame>
