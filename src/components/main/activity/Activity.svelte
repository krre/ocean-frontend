<script>
    import LatestComments from "./LatestComments.svelte";
    import LatestForumPosts from "./LatestForumPosts.svelte";
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
