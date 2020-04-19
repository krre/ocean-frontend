<script>
    import * as sapper from "@sapper/app";

    let id = "";
    let password = "";
    let save = true;

    async function login() {
        if (!id) {
            alert("Идентификатор не заполнен!");
            return;
        }

        if (!password) {
            alert("Пароль не заполнен!");
            return;
        }

        console.log("login", id, password, save);
    }

    function register() {
        sapper.goto("register");
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
    <button on:click={login}>Войти</button>
    <button on:click={register}>Регистрация</button>
</div>
