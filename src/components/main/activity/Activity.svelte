<script lang="ts">
    import * as api from "api";
    import LatestComments from "./LatestComments.svelte";
    import LatestForumPosts from "./LatestForumPosts.svelte";

    const LIMIT = 5;

    $: if (process.browser) {
        load();
    }

    async function load() {
        const params: api.Activity.GetAll.Request = {
            limit: LIMIT,
        };
        const result = await api.Activity.GetAll.exec(params);
        console.log(result);
    }
</script>

<style>
    .container {
        min-width: 30em;
        max-width: 100%;
    }
</style>

<div class="container">
    <LatestComments />
    <LatestForumPosts />
</div>
