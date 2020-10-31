<script lang="ts">
    import * as consts from "consts";
    import { goto } from "@sapper/app";
    import { send } from "network";
    import { createToken } from "utils";
    import OperationResult from "../../components/OperationResult.svelte";
    import AccountMode from "../../components/AccountMode.svelte";

    $: error = "";
    $: code = "";

    let name = "";
    let password1 = "";
    let password2 = "";

    $: singupButtonEnabled =
        password1 && password2 && (code === consts.Account.User ? name : true);

    async function signup() {
        if (password1 !== password2) {
            error = "Пароли не совпадают!";
            return;
        }

        let params: any = {
            name: code === consts.Account.Conspirator ? "" : name,
            code: code,
        };

        let result = await send("user.create", params);

        params = {};
        params.id = result.id;
        params.token = createToken(result.id, password1);

        await send("user.updateToken", params);

        goto("/register/user" + result.id);
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
    <title>Регистрация</title>
</svelte:head>

<h1>Регистрация</h1>

<div class="form">
    <AccountMode bind:code />
    {#if code === consts.Account.User}Имя: <input bind:value={name} />{/if}
    Пароль:
    <input type="password" bind:value={password1} />
    Пароль (ещё раз):
    <input type="password" bind:value={password2} />
    <OperationResult {error} />
    <button on:click={signup} disabled={!singupButtonEnabled}>
        Зарегистрироваться
    </button>
</div>
