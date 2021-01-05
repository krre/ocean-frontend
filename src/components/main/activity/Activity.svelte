<script lang="ts">
    import * as api from "api";
    import * as route from "route";
    import * as forum from "forum";
    import { makeTitle } from "utils";
    import type { ActivityMessage } from "types";
    import Latest from "./Latest.svelte";

    const LIMIT = 5;
    let comments: ActivityMessage[] = [];
    let topics: ActivityMessage[] = [];

    $: if (process.browser) {
        load();
    }

    async function load() {
        const params: api.Activity.GetAll.Request = {
            limit: LIMIT,
        };
        const result = await api.Activity.GetAll.exec(params);

        topics = [];

        result.topics.forEach((item: api.Activity.Topic) => {
            const topic: ActivityMessage = {
                title: item.name,
                url: forum.topicLink(item.id, item.post_count),
                date: item.post_create_ts,
                author: item.user_name,
                message: item.post,
            };

            topics.push(topic);
        });

        topics = topics;

        comments = [];

        result.comments.forEach((item: api.Activity.Comment) => {
            const comment: ActivityMessage = {
                title: makeTitle(item),
                url: route.Mandela.Id(item.mandela_id),
                date: item.create_ts,
                author: item.user_name,
                message: item.message,
            };

            comments.push(comment);
        });

        comments = comments;
    }
</script>

<style>
    .container {
        min-width: 30em;
        max-width: 100%;
    }
</style>

<div class="container">
    <Latest title="Последние комментарии" messages={comments} />
    <Latest
        title="Последние сообщения форума"
        link={route.Forum.New}
        messages={topics} />
</div>
