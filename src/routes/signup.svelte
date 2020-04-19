<script>
    let name = "";
    let password1 = "";
    let password2 = "";

    async function signup() {
        if (!password1) {
            alert("Первый пароль не заполнен!");
            return;
        }

        if (!password2) {
            alert("Второй пароль не заполнен!");
            return;
        }

        if (password1 !== password2) {
            alert("Пароли не совпадают!");
            return;
        }

        console.log("signup", name, password1);
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
    <title>Регистрация</title>
</svelte:head>

<h1>Регистрация</h1>

<div class="form">
    Имя (не обязательно):
    <input bind:value={name} />
    Пароль:
    <input type="password" bind:value={password1} />
    Пароль (ещё раз):
    <input type="password" bind:value={password2} />
    <button on:click={signup}>Зарегистрироваться</button>
</div>
