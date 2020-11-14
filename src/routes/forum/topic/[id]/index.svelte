<script lang="ts">
    import * as method from "method";
    import { send } from "network";
    import { onMount } from "svelte";
    import { stores } from "@sapper/app";
    import Session from "../../../../components/Session.svelte";
    import PostElement from "../../../../components/forum/post/PostElement.svelte";

    const { page } = stores();
    const topicId = +$page.params.id;

    let title: string;

    let isAdmin = false;
    let user;
    let posts = [];
    let post: string;

    onMount(async () => {
        load();
    });

    async function load() {
        const params = {
            topic_id: topicId,
            offset: 0,
            limit: 1000,
        };

        const result = await send(method.Forum.Post.GetAll, params);
        title = result.topic_name;
        posts = result.posts;
    }

    async function append() {
        const params = {
            topic_id: topicId,
            post: post,
        };

        const result = await send(method.Forum.Post.Create, params);
        post = "";
        load();
    }
</script>

<style>
    .area {
        max-width: 100%;
        width: 700px;
    }
</style>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<h1>{title}</h1>

<Session bind:user bind:isAdmin />

{#each posts as post}
    <PostElement {post} on:removed={() => load()} />
{/each}
<textarea class="area" rows="15" bind:value={post} />
<div><button on:click={append} disabled={!post}>Отправить</button></div>
