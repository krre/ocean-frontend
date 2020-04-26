<script>
    import * as sapper from "@sapper/app";
    import { Request } from "../js/json-rpc.js";
    import { sendRequest } from "../js/net.js";

    let name = "";
    let password1 = "";
    let password2 = "";

    $: singupButtonEnabled = password1 && password2;

    async function signup() {
        if (password1 !== password2) {
            alert("Пароли не совпадают!");
            return;
        }

        console.log("signup", name, password1);

        const params = {
            name: name,
            password: password1
        };

        const result = await sendRequest(new Request("user.create", params));
        console.log("id", result.id, "token", result.token);
        sapper.goto("/");
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
    Имя (не обязательно):
    <input bind:value={name} />
    Пароль:
    <input type="password" bind:value={password1} />
    Пароль (ещё раз):
    <input type="password" bind:value={password2} />
    <button on:click={signup} disabled={!singupButtonEnabled}>
        Зарегистрироваться
    </button>
</div>
