<script>
    import { goto, stores } from "@sapper/app";
    import { page, filter, category, sort } from "stores.js";
    const { session } = stores();

    function home() {
        $page = 1;
        $filter = 0;
        $category = 0;
        $sort = 0;
        goto(".");
    }
</script>

<style>
    nav {
        background-color: slateblue;
        padding: 1em;
    }

    .link {
        cursor: pointer;
        text-decoration: none;
        color: rgb(235, 246, 255);
        font-size: 1.1em;
        margin: 0.2em;
    }
</style>

<nav>
    <label class="link" on:click={home}>Каталог</label>
    <label class="link" on:click={() => goto('mandela/append')}>Добавить</label>
    <label class="link" on:click={() => goto('search')}>Поиск</label>
    {#if $session.user}
        <label class="link" on:click={() => goto('rating')}>Рейтинг</label>
    {/if}
    <label class="link" on:click={() => goto('help')}>Справка</label>
    {#if $session.user}
        <label class="link" on:click={() => goto('profile')}>Профиль</label>
    {/if}
    {#if $session.user}
        <label class="link" on:click={() => goto('signout')}>Выйти</label>
    {:else}
        <label class="link" on:click={() => goto('signin')}>Войти</label>
        <label class="link" on:click={() => goto('register')}>
            Регистрация
        </label>
    {/if}
</nav>
