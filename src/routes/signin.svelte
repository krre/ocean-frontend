<script>
    import * as sapper from "@sapper/app";
    import { Request } from "../js/json-rpc.js";
    import { sendRequest } from "../js/net.js";

    let id = 0;
    let password = "";
    let save = true;

    async function signin() {
        if (!id) {
            alert("Идентификатор не заполнен!");
            return;
        }

        if (!password) {
            alert("Пароль не заполнен!");
            return;
        }

        console.log("signin", id, password, save);

        const params = {
            id: id,
            password: password
        };

        const result = await sendRequest(new Request("user.auth", params));

        if (result.message) {
            alert(result.message);
        } else {
            console.log("token", result.token);
            sapper.goto("/");
        }
    }

    function signup() {
        sapper.goto("signup");
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
    <title>Войти</title>
</svelte:head>

<div class="form">
    Идентификатор:
    <input type="number" bind:value={id} />
    Пароль:
    <input type="password" bind:value={password} />
    <label>
        Запомнить
        <input type="checkbox" checked="true" bind:checked={save} />
    </label>
    <button on:click={signin}>Войти</button>
    <button on:click={signup}>Регистрация</button>
</div>
