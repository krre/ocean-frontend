<script lang="ts">
    import * as consts from "consts";
    import * as route from "route";
    import * as api from "api";
    import { goto, stores } from "@sapper/app";
    import Frame from "../../components/Frame.svelte";
    import MandelaEditor from "../../components/MandelaEditor.svelte";

    const { session } = stores();
    const pageTitle = "Добавить манделу";

    export let titleMode = consts.Mandela.Title.Simple;
    export let title = "";
    export let what = "";
    export let before = "";
    export let after = "";
    let description = "";
    let categories: number[] = [];

    async function append() {
        const params: api.Mandela.Create.Request = {
            title_mode: titleMode,
            title: titleMode === consts.Mandela.Title.Simple ? title : "",
            what: titleMode === consts.Mandela.Title.Complex ? what : "",
            before: titleMode === consts.Mandela.Title.Complex ? before : "",
            after: titleMode === consts.Mandela.Title.Complex ? after : "",
            description: description,
            categories: categories,
        };

        const result = await api.Mandela.Create.exec(params);
        goto(route.Mandela.Id(result.id));
    }
</script>

<Frame title={pageTitle}>
    <MandelaEditor
        bind:titleMode
        bind:title
        bind:what
        bind:before
        bind:after
        bind:description
        bind:categories
        bind:user={$session.user}
        on:click={append} />
</Frame>
