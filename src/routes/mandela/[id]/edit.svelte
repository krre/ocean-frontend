<script context="module" lang="ts">
    import { send } from "network";
    import type { Session } from "types";
    import * as route from "route";
    import * as method from "method";

    export async function preload(page, session: Session) {
        const { id } = page.params;

        let result = await send(method.Mandela.GetOne, { id: Number(id) });
        const mandela = result.mandela;
        const categories = result.categories;

        return { id, mandela, categories, session };
    }
</script>

<script lang="ts">
    import * as consts from "consts";
    import { goto } from "@sapper/app";
    import Page from "../../../components/Page.svelte";
    import MandelaEditor from "../../../components/MandelaEditor.svelte";

    const title = "Редактировать манделу";

    export let id: number;
    export let mandela;
    export let categories;
    export let session: Session;

    async function edit() {
        const params = {
            id: Number(id),
            title_mode: mandela.title_mode,
            title:
                mandela.title_mode === consts.Mandela.Title.Simple
                    ? mandela.title
                    : "",
            what:
                mandela.title_mode === consts.Mandela.Title.Complex
                    ? mandela.what
                    : "",
            before:
                mandela.title_mode === consts.Mandela.Title.Complex
                    ? mandela.before
                    : "",
            after:
                mandela.title_mode === consts.Mandela.Title.Complex
                    ? mandela.after
                    : "",
            description: mandela.description,
            categories: categories,
        };

        await send(method.Mandela.Update, params);
        goto(route.Mandela.Id(id));
    }
</script>

<Page {title}>
    <MandelaEditor
        bind:titleMode={mandela.title_mode}
        bind:title={mandela.title}
        bind:what={mandela.what}
        bind:before={mandela.before}
        bind:after={mandela.after}
        bind:description={mandela.description}
        bind:categories
        bind:user={session.user}
        on:click={edit} />
</Page>
