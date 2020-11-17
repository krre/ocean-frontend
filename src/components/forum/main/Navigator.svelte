<script lang="ts">
    import type { PathPart } from "forum";
    import * as route from "route";

    // export let category: PathPart;
    // export let section: PathPart;
    // export let topic: PathPart;

    let path: PathPart[];

    $: {
        path = [];
        path.push({ name: "Форум", route: route.Forum.Root });

        // if (category) {
        //     path.push(category);
        // }

        // if (section) {
        //     path.push(section);
        // }

        // if (topic) {
        //     path.push(topic);
        // }
    }
</script>

<style>
    .path {
        margin: 1em 0;
    }
</style>

<div class="path">
    {#each path as part, i}
        <a href={part.route}> {part.name}</a>
        {i < path.length - 1 ? '>' : ''}
    {/each}
</div>
