<script lang="ts">
    import * as route from "route";
    import * as api from "api";
    import { goto, stores } from "@sapper/app";
    import Frame from "../../../../../components/Frame.svelte";
    import SessionHub from "../../../../../components/SessionHub.svelte";
    import TopicEditor from "../../../../../components/forum/topic/TopicEditor.svelte";

    const { page } = stores();
    const sectionId = +$page.params.id;
    const title = "Создать тему";

    let isAdmin = false;
    let name: string;

    const action = async () => {
        const params: api.Forum.Topic.Create.Request = {
            section_id: sectionId,
            name: name,
        };

        await api.Forum.Topic.Create.exec(params);
        goto(route.Forum.Section.Id(sectionId));
    };
</script>

<SessionHub bind:isAdmin />

<Frame {title}>
    <TopicEditor bind:name {action} />
</Frame>
