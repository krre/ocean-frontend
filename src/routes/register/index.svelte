<script lang="ts">
    import * as consts from "consts";
    import * as route from "route";
    import * as api from "api";
    import { goto } from "@sapper/app";
    import { createToken } from "utils";
    import Frame from "../../components/Frame.svelte";
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

        const result = await api.User.GetNextId.exec();
        const id = result.id;

        const params: api.User.Create.Request = {
            id: id,
            name: name.trim(),
            code: consts.Account.User,
            token: createToken(id, password1),
        };

        await api.User.Create.exec(params);
        goto(route.Register.UserId(id));
    }
</script>

<Frame {title}>
    <BoxForm>
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
</Frame>
