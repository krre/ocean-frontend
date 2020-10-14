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
    <a href={consts.MandelaRoute + '/' + consts.AppendRoute}>Добавить</a>
    <a href={consts.SearchRoute}>Поиск</a>
    <a href={consts.RatingRoute}>Рейтинг</a>
    <a href={consts.HelpRoute}>Справка</a>
    {#if $session.user}<a href={consts.ProfileRoute}>Профиль</a>{/if}
    {#if $session.user}
        <a href={consts.SignoutRoute}>Выйти</a>
    {:else}
        <a href={consts.SigninRoute}>Войти</a>
        <a href={consts.RegisterRoute}>Регистрация</a>
    {/if}
</nav>
