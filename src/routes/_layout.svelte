<script context="module" lang="ts">
    import { setToken } from "network";

    export async function preload(page, session) {
        setToken(session.user ? session.user.token : "");
    }
</script>

<script lang="ts">
    import Nav from "../components/Nav.svelte";

    export let segment;
</script>

<style>
    :global(body) {
        margin: 0;
        font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        font-size: 90%;
    }

    main {
        padding: 0.5em;
    }
</style>

<Nav {segment} />

<main>
    <slot />
</main>
