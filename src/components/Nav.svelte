<script>
    import { stores } from "@sapper/app";
    const { session } = stores();
</script>

<style>

</style>

<nav>
    <a href=".">Каталог</a>
    <a href="topic/append">Добавить</a>
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
