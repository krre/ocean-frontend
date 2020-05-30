<script>
    import { goto, stores } from "@sapper/app";
    import { send, errorMessage } from "net.js";
    import { post } from "utils.js";
    import OperationResult from "../components/OperationResult.svelte";

    const { session } = stores();

    let id = 0;
    let password = "";

    $: signinButtonEnabled = id && password;
    $: error = "";

    async function signin() {
        const params = {
            id: id,
            password: password
        };

        try {
            const result = await send("user.auth", params);
            const user = {
                token: result.token,
                id: id,
                code: result.code,
                name: result.name
            };

            await post("auth/login", user);

            $session.user = user;
            goto("/");
        } catch (e) {
            error = errorMessage(e.code);
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
    ЧЗ:
    <input type="number" bind:value={id} />
    Пароль:
    <input type="password" bind:value={password} />
    <OperationResult {error} />
    <button on:click={signin} disabled={!signinButtonEnabled}>Войти</button>
</div>
