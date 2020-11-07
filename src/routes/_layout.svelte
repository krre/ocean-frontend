<script context="module" lang="ts">
    import { setToken } from "network";

    export async function preload(page, session) {
        setToken(session.user ? session.user.token : "");
    }
</script>

<script lang="ts">
    import Navbar from "../components/menu/Navbar.svelte";
    import Sidebar from "../components/menu/Sidebar.svelte";

    export let segment;
    let open = false;
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

<Sidebar bind:open on:itemClicked={() => (open = false)} />
<Navbar {segment} bind:sidebar={open} />

<main>
    <slot />
</main>
