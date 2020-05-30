<script context="module">
    import * as consts from "consts.js";
    import { send, errorMessage } from "net.js";
    import OperationResult from "../components/OperationResult.svelte";
    import AccountMode from "../components/AccountMode.svelte";

    export async function preload(page, session) {
        const user = await send("user.getOne", { token: session.user.token });
        return { user };
    }
</script>

<script>
    export let user;

    $: successProfile = "";
    $: errorProfile = "";

    $: successPassword = "";
    $: errorPassword = "";

    $: code = "";

    let password1;
    let password2;

    async function update() {
        const params = {};
        params.id = user.id;

        if (code === consts.UserAccount && !user.name) {
            errorProfile = "Введите имя";
            return;
        }

        params.name = code === consts.ConspiratorAccount ? "" : user.name;
        params.code = user.code === consts.AdminAccount ? user.code : code;

        try {
            await send("user.update", params);

            if (code === consts.ConspiratorAccount) {
                user.name = "";
            }

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

        const params = {};
        params.id = user.id;
        params.password = password1;

        try {
            await send("user.changePassword", params);
            password1 = "";
            password2 = "";
            successPassword = "Пароль успешно изменён";
        } catch (e) {
            errorPassword = errorMessage(e.code);
        }
    }
</script>

<style>
    .form {
        display: grid;
        grid-gap: 10px;
        width: 200px;
    }
</style>

<svelte:head>
    <title>Профиль</title>
</svelte:head>

<h1>Профиль</h1>
<div class="form">
    <div>ЧЗ:</div>
    <div>{user.id}</div>
    {#if user.code !== consts.AdminAccount}
        <AccountMode bind:code bind:initCode={user.code} />
    {/if}
    {#if code !== consts.ConspiratorAccount}
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
</div>
