<script lang="ts">
    import * as route from "route";
    import * as api from "api";
    import * as types from "types";
    import { goto, stores } from "@sapper/app";
    import Frame from "../../../../../components/Frame.svelte";
    import SessionHub from "../../../../../components/SessionHub.svelte";
    import TopicEditor from "../../../../../components/forum/topic/TopicEditor.svelte";

    const { page } = stores();
    const sectionId = +$page.params.id;
    const title = "Создать тему";

    let isAdmin = false;
    let name: string;

    let type = types.ForumTopicType.Common;
    let answerSelection = types.ForumPollAnswerSelection.One;
    let answers: string[] = [];

    const action = async () => {
        const params: api.Forum.Topic.Create.Request = {
            section_id: sectionId,
            name: name,
            type: type,
        };

        if (type === types.ForumTopicType.Poll) {
            params.poll_answers = answers;
            params.poll_answer_selection = answerSelection;
        }

        await api.Forum.Topic.Create.exec(params);
        goto(route.Forum.Section.Id(sectionId));
    };
</script>

<SessionHub bind:isAdmin />

<Frame {title}>
    <TopicEditor
        bind:name
        bind:type
        bind:answerSelection
        bind:answers
        {action}
    />
</Frame>
