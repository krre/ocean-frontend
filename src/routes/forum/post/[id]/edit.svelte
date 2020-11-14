<script context="module" lang="ts">
    import { send } from "network";
    import * as method from "method";

    export async function preload(page, session) {
        const { id } = page.params;

        let result = await send(method.Forum.Post.GetOne, {
            id: +id,
        });
        const post = result.post;
        const topicId = result.topic_id;

        return { id, post, topicId };
    }
</script>

<script lang="ts">
    import { goto } from "@sapper/app";
    import * as route from "route";

    export let id: number;
    export let post: string;
    export let topicId: number;

    async function edit() {
        const params = {
            id: +id,
            post: post,
        };

        await send(method.Forum.Post.Update, params);
        goto(route.Forum.Topic.Id(topicId));
    }
</script>

<style>
    .area {
        max-width: 100%;
        width: 700px;
    }
</style>

<textarea class="area" rows="15" bind:value={post} />
<div><button on:click={edit} disabled={!post}>Отправить</button></div>
