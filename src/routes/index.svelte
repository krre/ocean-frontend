<script context="module" lang="ts">
    import * as api from "api";
    import * as route from "route";
    import * as consts from "consts";
    import type { Session, Page, ActivityMessage } from "types";
    import { makeTitle } from "utils";

    const MANDELA_PAGE_LIMIT = 50;
    const ACTIVITY_PAGE_LIMIT = 5;

    export async function preload(page: Page, _session: Session) {
        const pageNo = +page.query.page || 1;
        const filter = +page.query.filter || 0;
        const category = +page.query.category || 0;
        const sort = +page.query.sort || 0;
        const userId = +page.query.user || 0;

        let params: api.Mandela.GetAll.Request = {
            sort: sort,
            limit: MANDELA_PAGE_LIMIT,
            offset: (pageNo - 1) * MANDELA_PAGE_LIMIT,
            filter: filter,
            category: category - 1,
        };

        if (userId) {
            params.user_id = userId;
        }

        const getAllResponse = await api.Mandela.GetAll.exec(params);

        const [topics, comments] = await loadActivity();

        return {
            getAllResponse,
            topics,
            comments,
            pageNo,
            filter,
            category,
            sort,
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
                id: item.post_id,
                title: item.name,
                baseUrl: route.Forum.Topic.Id(item.id),
                pageNo: Math.ceil(
                    item.post_count / consts.Forum.Post.PageLimit
                ),
                date: item.post_create_ts,
                userName: item.user_name,
                userId: item.user_id,
                message: item.post,
            };

            topics.push(topic);
        });

        const comments: ActivityMessage[] = [];

        result.comments.forEach((item: api.Activity.Comment) => {
            const comment: ActivityMessage = {
                id: item.id,
                title: makeTitle(item),
                baseUrl: route.Mandela.Id(item.mandela_id),
                pageNo: Math.ceil(
                    item.comment_count / consts.Mandela.Comment.PageLimit
                ),
                date: item.create_ts,
                userName: item.user_name,
                userId: item.user_id,
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

    export let getAllResponse: api.Mandela.GetAll.Response;
    export let topics: ActivityMessage[];
    export let comments: ActivityMessage[];

    export let pageNo = 1;
    export let filter = 0;
    export let category = 0;
    export let sort = 0;
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
        <Catalog
            {pageNo}
            {filter}
            {category}
            {sort}
            {getAllResponse}
            pageLimit={MANDELA_PAGE_LIMIT}
        />
    </div>

    <Activity {topics} {comments} />
</div>
