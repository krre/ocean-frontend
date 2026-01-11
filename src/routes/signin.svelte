<script lang="ts">
    import * as api from "$lib/api";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { setToken, errorMessage } from "$lib/network";
    import { post, createToken } from "$lib/utils";
    import Frame from "../components/Frame.svelte";
    import BoxForm from "../components/BoxForm.svelte";
    import OperationResult from "../components/OperationResult.svelte";

    const title = "Войти";

    let id = 0;
    let password = "";

    $: signinButtonEnabled = id && password;
    $: error = "";

    async function signin() {
        const token = createToken(id, password);

        const params: api.User.Auth.Request = {
            token: token,
        };

        try {
            const result = await api.User.Auth.exec(params);
            const user = {
                token: token,
                id: id,
                code: result.code,
                name: result.name,
            };

            await post("auth/login", user);
            $page.data.session.user = user;
            setToken(token);
            goto("/");
        } catch (e) {
            error = errorMessage(e);
        }
    }

    function keyPressed(event: any) {
        if (event.key == "Enter") {
            signin();
        }
    }
</script>

<Frame {title}>
    <BoxForm>
        ИД:
        <input type="number" bind:value={id} on:keyup={keyPressed} />
        Пароль:
        <input type="password" bind:value={password} on:keyup={keyPressed} />
        <OperationResult {error} />
        <button on:click={signin} disabled={!signinButtonEnabled}>Войти</button>
    </BoxForm>
</Frame>
