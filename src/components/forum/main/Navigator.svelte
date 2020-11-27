<script lang="ts">
    import type { PathPart } from "forum";
    import * as route from "route";

    export let category: PathPart = null;
    export let section: PathPart = null;
    export let topic: PathPart = null;

    let path: PathPart[];

    $: {
        path = [];
        path.push({ name: "Форум", route: route.Forum.Root });

        if (category) {
            category.route = route.Forum.Category.Id(category.id);
            path.push(category);
        }

        if (section) {
            section.route = route.Forum.Section.Id(section.id);
            path.push(section);
        }

        if (topic) {
            topic.route = route.Forum.Topic.Id(topic.id);
            path.push(topic);
        }
    }
</script>

<style>
    .path {
        margin: var(--page-margin);
    }

    .part {
        margin-right: 0.4em;
    }
</style>

<div class="path">
    {#each path as part, i}
        <a class="part" href={part.route}>{part.name}</a>
        <span class="part">{i < path.length - 1 ? '|' : ''}</span>
    {/each}
</div>
