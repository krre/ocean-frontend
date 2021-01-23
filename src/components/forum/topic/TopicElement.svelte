<script lang="ts">
    import * as route from "route";
    import * as dialog from "dialog";
    import * as api from "api";
    import * as types from "types";
    import type { User } from "types";
    import { goto } from "@sapper/app";
    import { createEventDispatcher } from "svelte";
    import SessionHub from "../../SessionHub.svelte";

    const dispatch = createEventDispatcher();

    export let topic: any;
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

    .buttons {
        display: flex;
        justify-content: flex-end;
        margin-top: 0.5em;
    }

    button {
        margin-right: 0.5em;
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
    <br /><br />
    <div>Автор темы: {topic.user_name}</div>
    {#if editable}
        <div class="buttons">
            <button on:click={editTopic}>Изменить</button>
            <button on:click={removeTopic}>Удалить</button>
        </div>
    {/if}
</div>
