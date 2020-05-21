<script context="module">
    import { Request } from "../js/json-rpc.js";
    import { sendRequest } from "../js/net.js";

    export async function preload(page, session) {
        let users = await sendRequest(
            new Request("user.get", { token: session.user.token })
        );

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
</div>
