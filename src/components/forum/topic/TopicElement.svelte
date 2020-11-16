<script lang="ts">
    import { send } from "network";
    import { formatDateTime } from "utils";
    import * as route from "route";
    import * as method from "method";
    import * as consts from "consts";
    import { goto } from "@sapper/app";
    import { createEventDispatcher } from "svelte";
    import Session from "../../../components/Session.svelte";

    const dispatch = createEventDispatcher();

    export let topic: any;
    export let editable = true;

    let isAdmin = false;
    let user;

    $: editable =
        isAdmin ||
        (user &&
            user.code !== consts.Account.Fierce &&
            user.id === topic.user_id);

    function editTopic() {
        goto(route.Forum.Topic.Edit(topic.id));
    }

    async function removeTopic() {
        const params = {
            id: +topic.id,
        };
        await send(method.Forum.Topic.Delete, params);
        dispatch("removed");
    }
</script>

<style>
    .topic {
        margin-top: 0.2em;
        margin-bottom: 0.2em;
        padding: 1em;
        border: 1px solid;
    }

    .buttons {
        display: flex;
        justify-content: flex-end;
    }

    button {
        margin-right: 0.5em;
    }
</style>

<Session bind:user bind:isAdmin />

<div class="topic">
    <a href={route.Forum.Topic.Id(topic.id)}>{topic.name}</a>
    <br /><br />
    <div>{topic.user_name} | {formatDateTime(topic.create_ts)}</div>
    {#if editable}
        <div class="buttons">
            <button on:click={editTopic}>Изменить</button>
            <button on:click={removeTopic}>Удалить</button>
        </div>
    {/if}
</div>
