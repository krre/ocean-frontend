<script lang="ts">
    import { send } from "network";
    import { formatDateTime } from "utils";
    import * as route from "route";
    import * as method from "method";
    import * as dialog from "dialog";
    import { goto } from "@sapper/app";
    import { createEventDispatcher } from "svelte";
    import Session from "../../../components/Session.svelte";

    const dispatch = createEventDispatcher();

    export let topic: any;
    export let editable = false;

    let isAdmin = false;
    let isAnonym = true;
    let user;

    $: editable = isAdmin || (user && user.id === topic.user_id && !isAnonym);

    function editTopic() {
        goto(route.Forum.Topic.Edit(topic.id));
    }

    async function removeTopic() {
        if (!dialog.remove("Удалить тему?")) return;

        const params = {
            id: +topic.id,
        };
        await send(method.Forum.Topic.Delete, params);
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

<Session bind:user bind:isAdmin bind:isAnonym />

<div class="topic">
    <a href={route.Forum.Topic.Id(topic.id)}>{topic.name}</a>
    <br /><br />
    <div>Автор темы: {topic.user_name}</div>
    {#if editable}
        <div class="buttons">
            <button on:click={editTopic}>Изменить</button>
            <button on:click={removeTopic}>Удалить</button>
        </div>
    {/if}
</div>
