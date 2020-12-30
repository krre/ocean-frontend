<script lang="ts">
    import { textCut } from "utils";
    import type { NewTopic } from "forum";
    import * as route from "route";
    import * as consts from "consts";
    import PostTitle from "../../PostTitle.svelte";

    export let topic: NewTopic;

    function topicLink(): string {
        const offset = Math.floor(
            topic.post_count / consts.Forum.Post.PageLimit
        );
        const query = offset ? `?page=${offset + 1}` : "";
        return route.Forum.Topic.Id(topic.id) + query;
    }
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
    <a href={topicLink()}><h3>{topic.name}</h3></a>
    <PostTitle author={topic.user_name} date={topic.post_create_ts} />
    <div class="post">{textCut(topic.post, 100)}</div>
</div>
