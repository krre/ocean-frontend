<script lang="ts">
    import * as forum from "forum";
    import * as route from "route";
    import { textCut } from "utils";
    import type { NewTopic } from "forum";
    import PostTitle from "../../PostTitle.svelte";

    export let topic: NewTopic;
</script>

<style>
    .topic {
        padding: var(--page-padding);
        border-bottom: var(--border-1px);
    }

    .topic:last-child {
        border-bottom: none;
    }

    .post {
        overflow-wrap: break-word;
        word-wrap: break-word;
    }

    h3 {
        margin: 0 0 0.3em 0;
    }
</style>

<div class="topic">
    <a href={forum.topicLink(topic.id, topic.post_count)}
        ><h3>
            {topic.name}
        </h3></a
    >
    <PostTitle
        id={topic.post_id}
        baseUrl={route.Forum.Topic.Id(topic.id)}
        userName={topic.user_name}
        userId={topic.user_id}
        date={topic.post_create_ts}
        replyable={false}
    />
    <div class="post">{textCut(topic.post, 300)}</div>
</div>
