<script context="module" lang="ts">
    import * as api from "api";
    import * as route from "route";
    import * as forum from "forum";
    import type { Session, Page, ActivityMessage } from "types";
    import { makeTitle } from "utils";

    const MANDELA_PAGE_LIMIT = 50;
    const ACTIVITY_PAGE_LIMIT = 5;

    export async function preload(page: Page, session: Session) {
        const [topics, comments] = await loadActivity();

        return {
            topics,
            comments,
        };
    }

    async function loadActivity(): Promise<
        [ActivityMessage[], ActivityMessage[]]
    > {
        const params: api.Activity.GetAll.Request = {
            limit: ACTIVITY_PAGE_LIMIT,
        };
        const result = await api.Activity.GetAll.exec(params);

        const topics: ActivityMessage[] = [];

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

        const comments: ActivityMessage[] = [];

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

        return [topics, comments];
    }
</script>

<script lang="ts">
    import Catalog from "../components/main/Catalog.svelte";
    import Activity from "../components/main/activity/Activity.svelte";

    export let topics: ActivityMessage[];
    export let comments: ActivityMessage[];
</script>

<style>
    .container {
        display: flex;
        flex-direction: column;
    }

    @media screen and (min-width: 75em) {
        .container {
            flex-direction: row;
        }

        .catalog {
            margin-right: -1em;
        }
    }

    .catalog {
        flex-grow: 1;
        margin-bottom: -1em;
    }
</style>

<div class="container">
    <div class="catalog">
        <Catalog />
    </div>

    <Activity {topics} {comments} />
</div>
