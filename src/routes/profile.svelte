<script context="module" lang="ts">
    import { send, setToken } from "network";
    import { formatDateTime, createToken } from "utils";

    export async function preload(page, session) {
        const user = await send("user.getOne");
        return { user };
    }
</script>

<script lang="ts">
    import * as consts from "consts";
    import { errorMessage } from "network";
    import { stores } from "@sapper/app";
    import BoxForm from "../components/BoxForm.svelte";
    import OperationResult from "../components/OperationResult.svelte";
    import AccountMode from "../components/AccountMode.svelte";

    const { session } = stores();

    export let user;

    $: successProfile = "";
    $: errorProfile = "";

    $: successPassword = "";
    $: errorPassword = "";

    $: code = "";

    let password1;
    let password2;

    async function update() {
        if (code === consts.Account.User && !user.name) {
            errorProfile = "Введите имя";
            return;
        }

        const params = {
            name: code === consts.Account.Conspirator ? "" : user.name,
            code: user.code === consts.Account.Admin ? user.code : code,
        };

        try {
            await send("user.update", params);

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
            await send("user.updateToken", params);
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

<svelte:head>
    <title>Профиль</title>
</svelte:head>

<BoxForm>
    <h2>Профиль</h2><span />
    <div>ИД: {user.id}</div>
    <div>Создано: {formatDateTime(user.create_ts)}</div>
    {#if user.code !== consts.Account.Admin}
        <AccountMode bind:code bind:initCode={user.code} />
    {/if}
    {#if code !== consts.Account.Conspirator}
        Имя:
        <input bind:value={user.name} />
    {/if}
    <OperationResult bind:success={successProfile} bind:error={errorProfile} />
    <button on:click={update}>Сохранить</button>
    Пароль:
    <input type="password" bind:value={password1} />
    Пароль (ещё раз):
    <input type="password" bind:value={password2} />
    <OperationResult
        bind:success={successPassword}
        bind:error={errorPassword} />
    <button on:click={changePassword}>Изменить</button>
</BoxForm>
