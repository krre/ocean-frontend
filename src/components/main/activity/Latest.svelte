<script lang="ts">
    import type { ActivityMessage } from "types";
    import { textCut } from "utils";
    import { formatDateTime } from "utils";
    import Rectangle from "../../Rectangle.svelte";
    export let title = "";
    export let messages: ActivityMessage[] = [];
    export let link = "#";
</script>

<style>
    .title {
        margin-bottom: var(--page-margin);
        /* font-size: 0.9rem; */
    }

    .message {
        overflow-wrap: anywhere;
        white-space: pre-line;
        font-size: 0.85rem;
        margin-bottom: 1em;
    }

    .message:last-child {
        margin-bottom: 0;
    }

    span {
        color: grey;
    }
</style>

<Rectangle>
    <div class="title"><a href={link}>{title}</a></div>
    {#each messages as message}
        <div class="message">
            <a href={message.url}>{message.title}</a>
            <br />
            <span>{formatDateTime(message.date)}, {message.author}</span>
            <br />
            {textCut(message.message, 200)}
        </div>
    {/each}
</Rectangle>
