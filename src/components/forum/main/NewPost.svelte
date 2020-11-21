<script lang="ts">
    import { formatDateTime, textCut } from "utils";
    import * as route from "route";

    export let topic;
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
    <a href={route.Forum.Topic.Id(topic.id)}><strong>{topic.name}</strong></a>
    <br /><br />
    <div>
        Автор:
        {topic.user_name}
        | Создано:
        {formatDateTime(topic.post_create_ts)}
    </div>
    <div class="post">{textCut(topic.post, 100)}</div>
</div>
