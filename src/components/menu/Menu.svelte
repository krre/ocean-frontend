<script lang="ts">
    import { stores } from "@sapper/app";
    import { createEventDispatcher } from "svelte";
    import * as route from "route";

    const { session } = stores();
    const dispatch = createEventDispatcher();
</script>

<style>
    a {
        text-decoration: none;
        color: rgb(235, 246, 255);
        font-size: 1.1em;
        margin-left: 0.7em;
        margin-top: 0.5em;
        margin-bottom: 0.5em;
    }

    nav {
        display: flex;
    }
</style>

<nav class={$$props.class} on:click={() => dispatch('itemClicked')}>
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
