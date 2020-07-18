<script context="module">
    import { send } from "net.js";

    export async function preload(page, session) {
        const { id } = page.params;

        return { id };
    }
</script>

<script>
    export let id;
</script>

<svelte:head>
    <title>Регистрация окончена</title>
</svelte:head>

<h1>Регистрация окончена</h1>
<h2>Ваш ИД: {id}</h2>

<p>Используйте его совместно с вашим паролем, чтобы входить на сайт.</p>
Если вы потеряете ИД или пароль, то не сможете их восставить, и вам придётся
регистрироваться заново.
<p>
    <a href="signin">Войти</a>
</p>
