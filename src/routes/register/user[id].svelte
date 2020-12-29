<script context="module" lang="ts">
    import type { Session } from "types";
    export async function preload(page, _session: Session) {
        const { id } = page.params;
        return { id };
    }
</script>

<script lang="ts">
    import Page from "../../components/Page.svelte";
    const title = "Регистрация окончена";
    export let id: number;
</script>

<Page {title}>
    <h2>Ваш ИД: {id}</h2>

    <p>Используйте его совместно с вашим паролем, чтобы входить на сайт.</p>
    Если вы потеряете ИД или пароль, то не сможете их восставить, и вам придётся
    регистрироваться заново.
    <p><a href="signin">Войти</a></p>
</Page>
