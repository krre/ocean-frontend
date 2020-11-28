<script lang="ts">
    import { formatDateTime } from "utils";

    export let author: string;
    export let date: Date;
</script>

<style>
    .title {
        color: gray;
        display: flex;
        margin-bottom: 1em;
    }

    .devider {
        margin: 0 0.5em;
    }
</style>

<div class="title">
    {author}<span class="devider">|</span>
    {formatDateTime(date)}
</div>
