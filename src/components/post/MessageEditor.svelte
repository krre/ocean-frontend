<script lang="ts">
    import PostEditor from "./PostEditor.svelte";
    import Rectangle from "../Rectangle.svelte";
    import SessionHub from "../../components/SessionHub.svelte";

    export let message = "";
    export let sendButtonEnabled = true;
    export let appendAction = async () => {};

    let userName: string;
    let postEditorRef: PostEditor;

    export function appendReply(userName: string, text: string) {
        postEditorRef.appendReply(userName, text);
    }

    async function action() {
        await appendAction();
        message = "";
    }
</script>

<style>
    button {
        margin-top: 0.5em;
    }
</style>

<SessionHub bind:userName />

<Rectangle padding={false} solid={false}>
    <PostEditor bind:post={message} bind:this={postEditorRef} />

    <div>Пользователь: {userName}</div>
    <button
        class="send"
        on:click={action}
        disabled={!(message.length > 0 && sendButtonEnabled)}>Отправить</button
    >
</Rectangle>
