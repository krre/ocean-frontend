<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { userUrl, dateUrl } from "$lib/utils";
    import { LikeSelection, LikeAction } from "$lib/types";
    import * as dialog from "$lib/dialog";
    import type * as api from "$lib/api";

    const dispatch = createEventDispatcher();

    export let baseUrl: string;
    export let pageNo: number;
    export let id: number;
    export let userName: string;
    export let userId: number;
    export let date: Date;
    export let row = 0;

    export let likeCount = 0;
    export let dislikeCount = 0;

    export let likeSelection: LikeSelection = LikeSelection.None;
    export let likeQuestion = false;
    export let likeUsers: api.Like.GetUsers.Response[] = null;

    export let likable = true;
    export let editable = false;
    export let removable = false;
    export let replyable = true;

    let likeUsersVisible = false;

    function showLikeUsers() {
        if (!likeUsersVisible) {
            dispatch("getLikeUsers", {
                row: row,
            });
        }

        likeUsersVisible = !likeUsersVisible;
    }

    function usersForAction(
        users: api.Like.GetUsers.Response[],
        action: LikeAction,
    ): string {
        let result = "";

        if (!users) return result;

        for (const user of users) {
            if (user.action !== action) continue;
            result += userUrl(user.name, user.id) + ", ";
        }

        if (result) {
            result = result.slice(0, result.length - 2);
        }

        return result;
    }

    function like(action: LikeAction) {
        dispatch("like", {
            row: row,
            action: action,
        });
    }

    function edit() {
        dispatch("edit", {
            row: row,
        });
    }

    function remove() {
        if (!dialog.remove("Удалить сообщение?")) return;

        dispatch("remove", {
            row: row,
        });
    }

    function reply() {
        dispatch("reply", {
            row: row,
        });
    }
</script>

<style>
    .title {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5em;
        color: gray;
        margin-bottom: 1em;
        align-items: center;
    }

    .like {
        cursor: pointer;
    }

    .up {
        color: #093;
    }

    .down {
        color: red;
    }

    button {
        color: gray;
        margin-left: 0.2em;
    }
</style>

<div class="title">
    {@html userUrl(userName, userId)} · {@html dateUrl(
        baseUrl,
        date,
        id,
        pageNo,
    )}

    {#if likable}
        ·
    {/if}

    <span>
        {#if likable}
            {#if likeSelection == LikeSelection.None}
                <button
                    on:click={() => {
                        like(LikeAction.Like);
                    }}><i class="far fa-thumbs-up" /></button
                >
            {:else}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <i
                    class="far fa-thumbs-up {likeSelection == LikeSelection.Like
                        ? 'like up'
                        : ''}"
                    on:click={() => {
                        likeSelection == LikeSelection.Like
                            ? like(LikeAction.Unlike)
                            : {};
                    }}
                />
            {/if}

            <span class={likeCount ? "up" : ""}>{likeCount}</span>

            {#if likeUsersVisible && likeCount}
                {@html usersForAction(likeUsers, LikeAction.Like)}
            {/if}

            {#if likeSelection == LikeSelection.None}
                <button
                    on:click={() => {
                        like(LikeAction.Dislike);
                    }}><i class="far fa-thumbs-down" /></button
                >
            {:else}
                &nbsp;
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <i
                    class="far fa-thumbs-down {likeSelection ==
                    LikeSelection.Dislike
                        ? 'like down'
                        : ''}"
                    on:click={() => {
                        likeSelection == LikeSelection.Dislike
                            ? like(LikeAction.Unlike)
                            : {};
                    }}
                />
            {/if}

            <span class={dislikeCount ? "down" : ""}>{dislikeCount}</span>

            {#if likeUsersVisible && dislikeCount}
                {@html usersForAction(likeUsers, LikeAction.Dislike)}
            {/if}

            {#if likeQuestion && (likeCount || dislikeCount)}
                <button
                    on:click={() => {
                        showLikeUsers();
                    }}><i class="fas fa-question" /></button
                >
            {/if}

            ·
        {/if}

        {#if editable}
            <button on:click={edit}><i class="fas fa-edit" /></button>
        {/if}

        {#if removable}
            <button on:click={remove}><i class="fas fa-trash-alt" /></button>
        {/if}

        {#if replyable}
            <button on:click={reply}><i class="fas fa-reply" /></button>
        {/if}
    </span>
</div>
