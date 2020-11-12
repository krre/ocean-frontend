<script lang="ts">
    import * as route from "route";

    export let section: any;
</script>

<style>
    .section {
        padding: 0.5em 0.7em;
    }
</style>

<div class="section">
    <a href={route.Forum.Section.Id(section.id)}>{section.name}</a>
</div>
