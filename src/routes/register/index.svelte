<script lang="ts">
    import * as consts from "consts";
    import * as route from "route";
    import * as method from "method";
    import { goto } from "@sapper/app";
    import { send } from "network";
    import { createToken } from "utils";
    import BoxForm from "../../components/BoxForm.svelte";
    import OperationResult from "../../components/OperationResult.svelte";

    const title = "Регистрация";

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

        const nextId = await send(method.User.GetNextId);
        const id = nextId.id;

        let params: object = {
            id: id,
            name: name,
            code: consts.Account.User,
            token: createToken(id, password1),
        };

        await send(method.User.Create, params);
        goto(route.Register.UserId(id));
    }
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<BoxForm>
    <h2>{title}</h2><span />
    Имя:
    <input bind:value={name} />
    Пароль:
    <input type="password" bind:value={password1} />
    Пароль (ещё раз):
    <input type="password" bind:value={password2} />
    <OperationResult {error} />
    <button on:click={signup} disabled={!singupButtonEnabled}>
        Зарегистрироваться
    </button>
</BoxForm>
