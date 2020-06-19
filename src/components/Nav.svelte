<script>
    import { stores } from "@sapper/app";
    const { session } = stores();
</script>

<style>
    nav {
        background-color: slateblue;
        padding: 1em;
    }

    a {
        text-decoration: none;
        color: rgb(235, 246, 255);
        font-size: 1.1em;
        margin: 0.2em;
    }
</style>

<nav>
    <a href=".">Каталог</a>
    <a href="mandela/append">Добавить</a>
    <a href="help">Справка</a>
    {#if $session.user}
        <a href="profile">Профиль</a>
    {/if}
    {#if $session.user}
        <a href="signout">Выйти</a>
    {:else}
        <a href="signin">Войти</a>
        <a href="register">Регистрация</a>
    {/if}
</nav>
