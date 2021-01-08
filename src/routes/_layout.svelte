<script context="module" lang="ts">
    import Modal from "../components/dialog/Modal.svelte";
    import { setToken } from "network";
    import type { Session, Page } from "types";

    export async function preload(_page: Page, session: Session) {
        setToken(session.user ? session.user.token : "");
    }
</script>

<script lang="ts">
    import Navbar from "../components/menu/Navbar.svelte";
    import Sidebar from "../components/menu/Sidebar.svelte";

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

    :global(img) {
        max-width: 100%;
        max-height: 100vh;
    }

    :global(.video) {
        max-width: 100%;
        max-height: auto;
        width: 420px;
        height: 315px;
    }

    :global(.quote) {
        background-color: rgb(244, 251, 255);
        border: var(--border-1px);
        padding: 0.7em;
    }
</style>

<Sidebar bind:open on:itemClicked={() => (open = false)} />
<Navbar bind:sidebar={open} />

<main>
    <slot />
    <Modal />
</main>
