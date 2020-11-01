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

        const nextId = await send("user.getNextId");
        const id = nextId.id;

        let params: object = {
            id: id,
            name: code === consts.Account.Conspirator ? "" : name,
            code: code,
            token: createToken(id, password1),
        };

        await send("user.create", params);
        goto("/register/user" + id);
    }
</script>

<style>
    .form {
        display: grid;
        grid-gap: 0.5em;
        max-width: 400px;
        margin: auto;
        padding: 1em;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
            0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
</style>

<svelte:head>
    <title>Регистрация</title>
</svelte:head>

<div class="form">
    <h2>Регистрация</h2><span />
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
