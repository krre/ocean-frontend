<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { userUrl, dateUrl } from "utils";
    import { LikeSelection, LikeAction } from "types";
    import * as dialog from "dialog";

    const dispatch = createEventDispatcher();

    export let baseUrl: string;
    export let pageNo: number;
    export let id: number;
    export let userName: string;
    export let userId: number;
    export let date: Date;
    export let row = 0;

    export let likes = 0;
    export let dislikes = 0;

    export let likeSelection = LikeSelection.None;

    export let editable = false;
    export let removable = false;
    export let replyable = true;

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
        color: red;
    }

    .down {
        color: blue;
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
        pageNo
    )}

    ·

    <span>
        {#if likeSelection == LikeSelection.None}
            <button
                on:click={() => {
                    like(LikeAction.Like);
                }}><i class="far fa-thumbs-up" /></button
            >
        {:else}
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

        {likes}

        {#if likeSelection == LikeSelection.None}
            <button
                on:click={() => {
                    like(LikeAction.Dislike);
                }}><i class="far fa-thumbs-down" /></button
            >
        {:else}
            &nbsp;
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

        {dislikes}

        ·

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
