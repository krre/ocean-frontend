<script lang="ts">
    import type { ActivityMessage } from "types";
    import Latest from "./Latest.svelte";

    export let comments: ActivityMessage[] = [];
    export let topics: ActivityMessage[] = [];
</script>

<style>
    .container {
        flex-basis: 25em;
        min-width: min(100%, 25em);
    }
</style>

<div class="container">
    <Latest title="Последние комментарии к манделам" messages={comments} />
    <Latest title="Последние сообщения форума" messages={topics} />
</div>
