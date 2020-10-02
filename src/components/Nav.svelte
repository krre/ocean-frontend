<script lang="ts">
    import { stores } from "@sapper/app";
    import { page, filter, category, sort } from "stores";
    const { session } = stores();

    function home() {
        $page = 1;
        $filter = 0;
        $category = 0;
        $sort = 0;
    }
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
    <a on:click={() => home()} href=".">Каталог</a>
    <a href="mandela/append">Добавить</a>
    <a href="search">Поиск</a>
    <a href="rating">Рейтинг</a>
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
