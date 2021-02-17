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

    .message-title {
        font-size: 0.93rem;
        margin-bottom: 0.1em;
    }

    .message-body {
        margin-top: 0.4em;
    }

    .message:last-child {
        margin-bottom: 0;
    }
</style>

<Rectangle>
    <div class="title">{title}</div>
    {#each messages as message}
        <div class="message">
            <div class="message-title">
                <a href={message.baseUrl}>{message.title}</a>
            </div>

            {@html userUrl(message.userName, message.userId)} · {@html dateUrl(
                message.baseUrl,
                message.date,
                message.id,
                message.pageNo
            )}
            <div class="message-body">
                {textCut(message.message, 200)}
            </div>
        </div>
    {/each}
</Rectangle>
