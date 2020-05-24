<script context="module">
    import { send } from "net.js";

    export async function preload(page, session) {
        const response = await send("user.get", { token: session.user.token });

        if (response.error) {
            console.error(response.error);
            return;
        }

        const user = response.result[0];
        return { user };
    }
</script>

<script>
    export let user;

    let password1;
    let password2;

    async function update() {
        const params = {};
        params.id = user.id;
        params.name = user.name;

        if (password1 || password2) {
            if (password1 !== password2) {
                alert("Пароли не совпадают!");
                return;
            } else {
                params.password = password1;
            }
        }

        const response = await send("user.update", params);

        if (response.error) {
            console.error(response.error);
            return;
        }

        password1 = "";
        password2 = "";
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
    <button on:click={update}>Сохранить</button>
</div>
