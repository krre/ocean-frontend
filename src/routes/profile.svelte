<script context="module">
    import { send, errorMessage } from "net.js";
    import OperationResult from "../components/OperationResult.svelte";

    export async function preload(page, session) {
        const result = await send("user.get", { token: session.user.token });
        const user = result[0];
        return { user };
    }
</script>

<script>
    export let user;

    $: success = "";
    $: error = "";

    let password1;
    let password2;

    async function update() {
        const params = {};
        params.id = user.id;
        params.name = user.name;

        if (password1 || password2) {
            if (password1 !== password2) {
                error = "Пароли не совпадают!";
                return;
            } else {
                params.password = password1;
            }
        }

        try {
            await send("user.update", params);
            password1 = "";
            password2 = "";
            success = "Профиль успешно обновлён";
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
    <title>Профиль</title>
</svelte:head>

<h1>Профиль</h1>
<div class="form">
    Идентификатор:
    <input value={user.id} readonly />
    Имя:
    <input bind:value={user.name} />
    Пароль:
    <input type="password" bind:value={password1} />
    Пароль (ещё раз):
    <input type="password" bind:value={password2} />
    <OperationResult {error} {success} />
    <button on:click={update}>Сохранить</button>
</div>
