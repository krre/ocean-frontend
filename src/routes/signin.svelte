<script lang="ts">
    import { goto, stores } from "@sapper/app";
    import { send, setToken, errorMessage } from "network";
    import { post, createToken } from "utils";
    import OperationResult from "../components/OperationResult.svelte";

    const { session } = stores();

    let id = 0;
    let password = "";

    $: signinButtonEnabled = id && password;
    $: error = "";

    async function signin() {
        const token = createToken(id, password);

        const params = {
            token: token,
        };

        try {
            const result = await send("user.auth", params);
            const user = {
                token: token,
                id: id,
                code: result.code,
                name: result.name,
            };

            await post("auth/login", user);
            $session.user = user;
            setToken(token);
            goto("/");
        } catch (e) {
            error = errorMessage(e.code);
        }
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
    <title>Войти</title>
</svelte:head>

<div class="form">
    <h2>Войти</h2><span />
    ИД:
    <input type="number" bind:value={id} />
    Пароль:
    <input type="password" bind:value={password} />
    <OperationResult {error} />
    <button on:click={signin} disabled={!signinButtonEnabled}>Войти</button>
</div>
