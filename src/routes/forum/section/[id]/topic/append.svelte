<script lang="ts">
    import { send } from "network";
    import { goto, stores } from "@sapper/app";
    import * as method from "method";
    import * as route from "route";
    import Session from "../../../../../components/Session.svelte";
    import TopicEditor from "../../../../../components/forum/topic/TopicEditor.svelte";

    const { page } = stores();
    const title = "Создать тему";

    let isAdmin = false;
    let name: string;

    const action = async () => {
        const params = {
            section_id: +$page.params.id,
            name: name,
        };

        const result = await send(method.Forum.Topic.Create, params);
        goto(route.Forum.Topic.Id(result.id));
    };
</script>

<Session bind:isAdmin />

<svelte:head>
    <title>{title}</title>
</svelte:head>

<h1>{title}</h1>

<TopicEditor bind:name {action} />