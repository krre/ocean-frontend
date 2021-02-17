<script lang="ts">
    import type { ActivityMessage } from "types";
    import { textCut } from "utils";
    import { userUrl, dateUrl } from "utils";
    import Rectangle from "../../Rectangle.svelte";

    export let title = "";
    export let messages: ActivityMessage[] = [];
</script>

<style>
    .title {
        margin-bottom: var(--page-margin);
    }

    .message {
        word-break: break-word;
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
    <div class="title">{title}</div>
    {#each messages as message}
        <div class="message">
            <a href={message.baseUrl}>{message.title}</a>
            <br />
            <span
                >{@html dateUrl(
                    message.baseUrl,
                    message.date,
                    message.id,
                    message.pageNo
                )} · {@html userUrl(message.userName, message.userId)}</span
            >
            <br />
            {textCut(message.message, 200)}
        </div>
    {/each}
</Rectangle>
