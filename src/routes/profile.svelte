<script context="module" lang="ts">
    import * as api from "api";
    import { setToken } from "network";
    import type { Session, Page } from "types";
    import { formatDateTime, createToken } from "utils";

    export async function preload(_page: Page, session: Session) {
        const params: api.User.GetOne.Request = {
            id: +session.user.id,
        };

        const user = await api.User.GetOne.exec(params);
        return { user };
    }
</script>

<script lang="ts">
    import * as consts from "consts";
    import { errorMessage } from "network";
    import type { User } from "types";
    import { stores } from "@sapper/app";
    import Frame from "../components/Frame.svelte";
    import OperationResult from "../components/OperationResult.svelte";
    import Profile from "../components/Profile.svelte";

    export let user: User;

    const { session } = stores();
    const title = "Профиль";

    let currentGender = user.gender;

    let successProfile: string;
    let errorProfile: string;

    let successPassword: string;
    let errorPassword: string;

    let password1: string;
    let password2: string;

    async function update() {
        const params: api.User.Update.Request = {
            name: user.name,
            code: user.code,
            gender: currentGender,
        };

        try {
            await api.User.Update.exec(params);

            $session.user.name = params.name;
            $session.user.code = params.code;

            successProfile = "Профиль успешно обновлён";
        } catch (e) {
            errorProfile = errorMessage(e);
        }
    }

    async function changePassword() {
        if (!password1 || !password2) {
            errorPassword = "Введите пароль";
            return;
        }

        if (password1 !== password2) {
            errorPassword = "Пароли не совпадают!";
            return;
        }

        const token = createToken(user.id, password1);

        const params: api.User.UpdateToken.Request = {
            token: token,
        };

        try {
            await api.User.UpdateToken.exec(params);
            setToken(token);
            $session.user.token = token;

            password1 = "";
            password2 = "";
            successPassword = "Пароль успешно изменён";
        } catch (e) {
            errorPassword = errorMessage(e);
        }
    }
</script>

<style>
    .grid {
        display: grid;
        grid-gap: 0.5em;
        grid-template-columns: max-content auto;
    }
</style>

<Frame {title}>
    <div class="grid">
        <div>ИД:</div>
        <div>{user.id}</div>
        <div>Имя:</div>
        <div><input bind:value={user.name} /></div>
        <div>Пол:</div>
        <div>
            <select bind:value={currentGender}>
                {#each consts.Genders as gender, i}
                    <option value={i}>{gender}</option>
                {/each}
            </select>
        </div>

        <div />
        <div>
            <OperationResult
                bind:success={successProfile}
                bind:error={errorProfile}
            />
        </div>

        <div />
        <div>
            <button on:click={update} disabled={!user.name}>Сохранить</button>
        </div>

        <div>Пароль:</div>
        <div><input type="password" bind:value={password1} /></div>
        <div>Пароль (ещё раз):</div>
        <div><input type="password" bind:value={password2} /></div>

        <div />
        <div>
            <OperationResult
                bind:success={successPassword}
                bind:error={errorPassword}
            />
        </div>

        <div />
        <div><button on:click={changePassword}>Изменить</button></div>

        <Profile {user} />
    </div>
</Frame>
