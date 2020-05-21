<script>
    import { stores } from "@sapper/app";
    const { session } = stores();
</script>

<style>

</style>

<nav>
    <a href=".">Каталог</a>
    {#if $session.user}
        <a href="append">Добавить</a>
    {/if}
    <a href="about">О сайте</a>
    {#if $session.user}
        <a href="signout">Выйти</a>
    {:else}
        <a href="signin">Войти</a>
    {/if}
</nav>
