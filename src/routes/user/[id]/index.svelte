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
    import * as dialog from "dialog";
    import Frame from "../../../components/Frame.svelte";
    import Profile from "../../../components/Profile.svelte";
    import SessionHub from "../../../components/SessionHub.svelte";

    export let user: api.User.GetOne.Response;
    let isAdmin = false;
    let isUserExists = true;

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

    async function deleteUser() {
        if (!dialog.remove("Удалить пользователя?")) return;

        const params: api.User.Delete.Request = {
            id: user.id,
        };

        await api.User.Delete.exec(params);
        isUserExists = false;
    }
</script>

<style>
    .blocked {
        color: red;
        margin-top: 0;
    }

    .column {
        display: flex;
        gap: 0.5em;
        flex-direction: column;
    }

    .grid {
        display: grid;
        grid-template-columns: max-content auto;
        gap: 0.5em;
    }

    .message {
        color: red;
    }
</style>

<SessionHub bind:isAdmin />

<Frame title="Пользователь">
    {#if user.blocked}
        <h3 class="blocked">Акканут заблокирован!</h3>
    {/if}

    <div class="column">
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
            {#if isUserExists}
                <label>
                    <input
                        type="checkbox"
                        bind:checked={user.blocked}
                        on:change={(_) => updateUser()}
                    />
                    Заблокировано
                </label>

                <div>
                    <button on:click={deleteUser}>Удалить</button>
                </div>
            {:else}
                <div class="message">Пользователь удалён</div>
            {/if}
        {/if}
    </div>
</Frame>
