<script lang="ts">
    import { send } from "network";
    import { goto, stores } from "@sapper/app";
    import * as method from "method";
    import * as route from "route";
    import Frame from "../../../../../components/Frame.svelte";
    import SessionHub from "../../../../../components/SessionHub.svelte";
    import TopicEditor from "../../../../../components/forum/topic/TopicEditor.svelte";

    const { page } = stores();
    const sectionId = +$page.params.id;
    const title = "Создать тему";

    let isAdmin = false;
    let name: string;

    const action = async () => {
        const params = {
            section_id: sectionId,
            name: name,
        };

        await send(method.Forum.Topic.Create, params);
        goto(route.Forum.Section.Id(sectionId));
    };
</script>

<SessionHub bind:isAdmin />

<Frame {title}>
    <TopicEditor bind:name {action} />
</Frame>
