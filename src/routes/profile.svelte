<script context="module">
    import { send } from "net.js";

    export async function preload(page, session) {
        let users = await send("user.get", { token: session.user.token });

        const user = users[0];
        console.log(user);

        return { user };
    }
</script>

<script>
    import { stores } from "@sapper/app";

    const { session } = stores();

    export let user;
    $: name = user.name;
    $: id = user.id;

    let password1;
    let password2;

    async function update() {
        const params = {};
        params.id = id;
        params.name = name;

        if (password1 || password2) {
            if (password1 !== password2) {
                alert("Пароли не совпадают!");
                return;
            } else {
                params.password = password1;
            }
        }

        const result = await send("user.update", params);
        password1 = "";
        password2 = "";
        console.log(result);
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
    <input bind:value={id} readonly />
    Имя:
    <input bind:value={name} />
    Пароль:
    <input type="password" bind:value={password1} />
    Пароль (ещё раз):
    <input type="password" bind:value={password2} />
    <button on:click={update}>Сохранить</button>
</div>
