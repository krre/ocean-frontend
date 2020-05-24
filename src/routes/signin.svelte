<script>
    import { goto, stores } from "@sapper/app";
    import { send } from "net.js";
    import { post } from "utils.js";

    const { session } = stores();

    let id = 0;
    let password = "";
    let save = true;

    $: signinButtonEnabled = id && password;

    async function signin() {
        const params = {
            id: id,
            password: password
        };

        const result = await send("user.auth", params);

        if (result.message) {
            alert(result.message);
        } else {
            const user = { token: result.token, id: id };

            if (save) {
                await post("auth/login", user);
            }

            $session.user = user;
            goto("/");
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
    <title>Войти</title>
</svelte:head>

<h1>Войти</h1>

<div class="form">
    Идентификатор:
    <input type="number" bind:value={id} />
    Пароль:
    <input type="password" bind:value={password} />
    <label>
        Запомнить
        <input type="checkbox" bind:checked={save} />
    </label>
    <button on:click={signin} disabled={!signinButtonEnabled}>Войти</button>
</div>
