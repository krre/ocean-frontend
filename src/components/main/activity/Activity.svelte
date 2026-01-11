<script lang="ts">
    import type { ActivityMessage } from "$lib/types";
    import Latest from "./Latest.svelte";
    import Feed from "./Feed.svelte";

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
    <Feed />
    <Latest title="Последние комментарии к манделам" messages={comments} />
    <Latest title="Последние сообщения форума" messages={topics} />
</div>
