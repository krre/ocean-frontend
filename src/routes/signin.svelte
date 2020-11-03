<script lang="ts">
    import * as method from "method";
    import { goto, stores } from "@sapper/app";
    import { send, setToken, errorMessage } from "network";
    import { post, createToken } from "utils";
    import BoxForm from "../components/BoxForm.svelte";
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
            const result = await send(method.User.Auth, params);
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

<svelte:head>
    <title>Войти</title>
</svelte:head>

<BoxForm>
    <h2>Войти</h2><span />
    ИД:
    <input type="number" bind:value={id} />
    Пароль:
    <input type="password" bind:value={password} />
    <OperationResult {error} />
    <button on:click={signin} disabled={!signinButtonEnabled}>Войти</button>
</BoxForm>
