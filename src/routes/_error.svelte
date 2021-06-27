<script lang="ts">
    import * as route from "route";
    import { goto } from "@sapper/app";
    import { Code } from "api-error";
    import Frame from "../components/Frame.svelte";

    interface Message {
        code: number;
        message: String;
    }

    interface Error {
        message: Message;
        stack: string;
    }

    export let status: string;
    export let error: Error;

    const dev = process.env.NODE_ENV === "development";

    $: if (process.browser && error.message.code == Code.AccountBlocked) {
        goto(route.Signout);
    }
</script>

<style>
</style>

<Frame title={status}>
    <p>{JSON.stringify(error.message)}</p>

    {#if dev && error.stack}
        <pre>{error.stack}</pre>
    {/if}
</Frame>
