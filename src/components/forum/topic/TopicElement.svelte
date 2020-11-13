<script lang="ts">
    import * as route from "route";

    export let topic;
</script>

<style>
    .topic {
        margin-top: 0.2em;
        margin-bottom: 0.2em;
        padding: 1em;
        border: 1px solid;
    }
</style>

<div class="topic">
    <a href={route.Forum.Topic.Id(topic.id)}>{topic.name}</a>
</div>
