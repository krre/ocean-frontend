<script>
    import * as sapper from "@sapper/app";
    import { send } from "net.js";

    let name = "";
    let password1 = "";
    let password2 = "";

    $: singupButtonEnabled = password1 && password2;

    async function signup() {
        if (password1 !== password2) {
            alert("Пароли не совпадают!");
            return;
        }

        const params = {
            name: name,
            password: password1
        };

        const response = await send("user.create", params);

        if (response.error) {
            console.error(response.error);
        } else {
            sapper.goto("/");
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
