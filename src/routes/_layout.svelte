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
    :global(:root) {
        --border-1px: 1px solid rgba(0, 0, 0, 0.2);
        --header-background: rgba(0, 0, 0, 0.07);
        --page-background: rgb(239, 239, 240);
        --page-padding: 1em;
        --page-margin: 1em;
    }

    :global(body) {
        margin: 0;
        font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        font-size: 90%;
        background-color: var(--page-background);
    }

    :global(a) {
        color: teal;
        text-decoration: none;
    }

    :global(a:hover) {
        color: olive;
        text-decoration: underline;
    }
</style>

<Sidebar bind:open on:itemClicked={() => (open = false)} />
<Navbar {segment} bind:sidebar={open} />

<main>
    <slot />
</main>
