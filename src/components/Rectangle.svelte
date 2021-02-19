<script lang="ts">
    export let padding = true;
    export let solid = true;
</script>

<style>
    .rect {
        margin: var(--page-margin);
    }

    @media screen and (max-width: 600px) {
        .rect {
            margin: var(--page-margin) 0;
        }
    }

    .solid {
        background-color: white;
        border: var(--border-1px);
    }

    .padding {
        padding: 1em;
    }
</style>

<div class="rect" class:solid class:padding>
    <slot />
</div>
