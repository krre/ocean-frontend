<script>
    import * as consts from "consts.js";
    import { goto } from "@sapper/app";
    import { send } from "net.js";
    import OperationResult from "../../components/OperationResult.svelte";
    import AccountMode from "../../components/AccountMode.svelte";

    $: error = "";
    $: code = consts.UserAccount;

    let name = "";
    let password1 = "";
    let password2 = "";

    $: singupButtonEnabled =
        password1 && password2 && (code === consts.UserAccount ? name : true);

    async function signup() {
        if (password1 !== password2) {
            error = "Пароли не совпадают!";
            return;
        }

        const params = {
            name: name,
            password: password1,
            code: code
        };

        let result = await send("user.create", params);
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
    {#if code === consts.UserAccount}
        Имя:
        <input bind:value={name} />
    {/if}
    Пароль:
    <input type="password" bind:value={password1} />
    Пароль (ещё раз):
    <input type="password" bind:value={password2} />
    <OperationResult {error} />
    <button on:click={signup} disabled={!singupButtonEnabled}>
        Зарегистрироваться
    </button>
</div>
