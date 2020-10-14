<script lang="ts">
    import { stores } from "@sapper/app";
    import * as consts from "consts";
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
    <a href={consts.Route.Mandela + '/' + consts.Route.Append}>Добавить</a>
    <a href={consts.Route.Search}>Поиск</a>
    <a href={consts.Route.Rating}>Рейтинг</a>
    <a href={consts.Route.Help}>Справка</a>
    {#if $session.user}<a href={consts.Route.Profile}>Профиль</a>{/if}
    {#if $session.user}
        <a href={consts.Route.Signout}>Выйти</a>
    {:else}
        <a href={consts.Route.Signin}>Войти</a>
        <a href={consts.Route.Register}>Регистрация</a>
    {/if}
</nav>
