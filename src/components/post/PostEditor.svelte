<script lang="ts">
    import LinkDialog from "./LinkDialog.svelte";
    import ImageDialog from "./ImageDialog.svelte";
    import VideoDialog from "./VideoDialog.svelte";
    import { insertText } from "utils";
    import * as dialog from "dialog";

    export let post = "";
    let areaRef;

    function appendBold() {
        replaceSelection((str: string) => `⁅b⁆${str}⁅/b⁆`);
    }

    function appendItalic() {
        replaceSelection((str: string) => `⁅i⁆${str}⁅/i⁆`);
    }

    function appendUnderline() {
        replaceSelection((str: string) => `⁅u⁆${str}⁅/u⁆`);
    }

    function appendStrikethrough() {
        replaceSelection((str: string) => `⁅s⁆${str}⁅/s⁆`);
    }

    const replaceSelection = (handler) => {
        const start = areaRef.selectionStart;
        const end = areaRef.selectionEnd;

        const str = areaRef.value.substring(start, end);
        const result = handler(str);
        post =
            post.substring(0, start) +
            result +
            post.substring(end, post.length);
    };

    function onOkLink(link: string, description: string) {
        const htmlLink = description
            ? `⁅url="${link}"⁆${description}⁅/url⁆`
            : `⁅url⁆${link}⁅/url⁆`;
        post = insertText(post, areaRef.selectionStart, htmlLink);
    }

    function onOkImage(link: string, width?: number) {
        const widthProp = width ? "=" + width.toString() : "";
        const htmlImage = `⁅img${widthProp}⁆${link}⁅/img⁆`;
        post = insertText(post, areaRef.selectionStart, htmlImage);
    }

    function onOkVideo(link: string) {
        const htmlVideo = `⁅youtube⁆${link}⁅/youtube⁆`;
        post = insertText(post, areaRef.selectionStart, htmlVideo);
    }
</script>

<style>
    .container {
        max-width: 100%;
        width: 50em;
        display: flex;
        flex-direction: column;
    }

    .toolbar {
        border-top: var(--border-1px);
        border-left: var(--border-1px);
        border-right: var(--border-1px);
        padding: 0.4em;
        background-color: rgb(236, 238, 255);
    }

    .area {
        margin-bottom: 0.5em;
    }

    button {
        margin-left: 0.3em;
    }
</style>

<div class="container">
    <div class="toolbar">
        <button on:click={appendBold}><i class="fas fa-bold" /></button>

        <button on:click={appendItalic}><i class="fas fa-italic" /></button>

        <button on:click={appendUnderline}><i
                class="fas fa-underline" /></button>

        <button on:click={appendStrikethrough}><i
                class="fas fa-strikethrough" /></button>

        <button on:click={() => dialog.open(LinkDialog, { onOk: onOkLink })}><i
                class="fas fa-link" /></button>

        <button
            on:click={() => dialog.open(ImageDialog, { onOk: onOkImage })}><i
                class="fas fa-image" /></button>

        <button
            on:click={() => dialog.open(VideoDialog, { onOk: onOkVideo })}><i
                class="fab fa-youtube" /></button>
    </div>
    <textarea class="area" rows="10" bind:value={post} bind:this={areaRef} />
</div>
