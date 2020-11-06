<script lang="ts">
    import { stores } from "@sapper/app";
    import * as route from "route";
    const { session } = stores();
</script>

<style>
    a {
        text-decoration: none;
        color: rgb(235, 246, 255);
        font-size: 1.1em;
        margin-left: 0.7em;
    }

    nav {
        display: flex;
    }
</style>

<nav>
    <a href=".">Каталог</a>
    <a href={route.Mandela.Append}>Добавить</a>
    <a href={route.Search}>Поиск</a>
    <a href={route.Rating}>Рейтинг</a>
    <!-- <a href={route.Forum.Root}>Форум</a> -->
    <a href={route.Help}>Справка</a>
    {#if $session.user}<a href={route.Profile}>Профиль</a>{/if}
    {#if $session.user}
        <a href={route.Signout}>Выйти</a>
    {:else}
        <a href={route.Signin}>Войти</a>
        <a href={route.Register.Root}>Регистрация</a>
    {/if}
</nav>
