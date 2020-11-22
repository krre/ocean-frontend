<script lang="ts">
    import { formatDateTime, textCut } from "utils";
    import * as route from "route";
    import * as consts from "consts";

    export let topic;

    function topicLink(id: number, postCount: number): string {
        const offset = Math.floor(postCount / consts.Forum.Post.PageLimit);
        const query = offset ? `?page=${offset + 1}` : "";
        return route.Forum.Topic.Id(topic.id) + query;
    }
</script>

<style>
    .topic {
        margin: 0.2em 0;
        padding: 1em;
        border: 1px solid;
    }

    .post {
        margin-top: 0.5em;
    }
</style>

<div class="topic">
    <a
        href={topicLink(topic.id, topic.post_count)}><strong>{topic.name}</strong></a>
    <br /><br />
    <div>
        Автор:
        {topic.user_name}
        | Создано:
        {formatDateTime(topic.post_create_ts)}
    </div>
    <div class="post">{textCut(topic.post, 100)}</div>
</div>
