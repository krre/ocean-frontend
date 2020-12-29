<script context="module" lang="ts">
    import * as method from "method";
    import { send, setToken } from "network";
    import type { Session } from "types";
    import { formatDateTime, createToken } from "utils";

    export async function preload(_page, _session: Session) {
        const user = await send(method.User.GetOne);
        return { user };
    }
</script>

<script lang="ts">
    import { errorMessage } from "network";
    import type { User } from "types";
    import { stores } from "@sapper/app";
    import Frame from "../components/Frame.svelte";
    import OperationResult from "../components/OperationResult.svelte";

    const { session } = stores();

    const title = "Профиль";
    export let user: User;

    let successProfile: string;
    let errorProfile: string;

    let successPassword: string;
    let errorPassword: string;

    let password1: string;
    let password2: string;

    async function update() {
        const params = {
            name: user.name,
            code: user.code,
        };

        try {
            await send(method.User.Update, params);

            $session.user.name = params.name;
            $session.user.code = params.code;

            successProfile = "Профиль успешно обновлён";
        } catch (e) {
            errorProfile = errorMessage(e.code);
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

        const params = {
            token: token,
        };

        try {
            await send(method.User.UpdateToken, params);
            setToken(token);
            $session.user.token = token;

            password1 = "";
            password2 = "";
            successPassword = "Пароль успешно изменён";
        } catch (e) {
            errorPassword = errorMessage(e.code);
        }
    }
</script>

<style>
    .grid {
        display: grid;
        grid-gap: 0.5em;
        max-width: 250px;
    }
</style>

<Frame {title}>
    <div class="grid">
        <div>ИД: {user.id}</div>
        <div>Создано: {formatDateTime(user.create_ts)}</div>
        Имя:<input bind:value={user.name} />
        <OperationResult
            bind:success={successProfile}
            bind:error={errorProfile} />
        <button on:click={update} disabled={!user.name}>Сохранить</button>
        Пароль:
        <input type="password" bind:value={password1} />
        Пароль (ещё раз):
        <input type="password" bind:value={password2} />
        <OperationResult
            bind:success={successPassword}
            bind:error={errorPassword} />
        <button on:click={changePassword}>Изменить</button>
    </div>
</Frame>
