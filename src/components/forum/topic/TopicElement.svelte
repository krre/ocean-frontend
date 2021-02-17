<script lang="ts">
    import * as consts from "consts";
    import * as route from "route";
    import * as dialog from "dialog";
    import * as api from "api";
    import * as types from "types";
    import type { User } from "types";
    import { formatDateTime, userUrl, dateUrl } from "utils";
    import { goto } from "@sapper/app";
    import { createEventDispatcher } from "svelte";
    import SessionHub from "../../SessionHub.svelte";

    const dispatch = createEventDispatcher();

    export let topic: api.Forum.Topic.GetAll.Topic;
    export let editable = false;

    let isAdmin = false;
    let isAnonym = true;
    let user: User;

    $: editable = isAdmin || (user && user.id === topic.user_id && !isAnonym);

    function editTopic() {
        goto(route.Forum.Topic.Edit(topic.id));
    }

    async function removeTopic() {
        if (!dialog.remove("Удалить тему?")) return;

        const params: api.Forum.Topic.Delete.Request = {
            id: +topic.id,
        };
        await api.Forum.Topic.Delete.exec(params);
        dispatch("removed");
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

    .info {
        margin-top: 0.5em;
        color: rgb(90, 90, 90);
    }

    button {
        margin-left: 0.2em;
        color: gray;
    }
</style>

<SessionHub bind:user bind:isAdmin bind:isAnonym />

<div class="topic">
    <a href={route.Forum.Topic.Id(topic.id)}>
        {#if topic.type == types.ForumTopicType.Poll}
            <i class="fas fa-poll" />
        {/if}
        {topic.name}</a
    >
    {#if editable}
        <span>
            <button on:click={editTopic}><i class="fas fa-edit" /></button>
            <button on:click={removeTopic}
                ><i class="fas fa-trash-alt" /></button
            >
        </span>
    {/if}
    <div class="info">
        {@html userUrl(topic.user_name, topic.user_id)} · {formatDateTime(
            topic.create_ts
        )}
    </div>
    <div class="info">
        Постов: {topic.post_count} · Последний: {@html dateUrl(
            route.Forum.Topic.Id(topic.id),
            topic.last_post_create_ts,
            topic.last_post_id,
            Math.ceil(topic.post_count / consts.Forum.Post.PageLimit)
        )}
    </div>
</div>
