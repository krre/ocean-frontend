<script>
    import Menu from "./Menu.svelte";
    export let open = false;
</script>

<style>
    aside {
        position: absolute;
        width: 100%;
        height: 100%;
        left: -100%;
        transition: left 0.3s ease-in-out;
        background-color: slateblue;
    }

    .open {
        left: 0;
    }
</style>

<aside class:open>
    <Menu on:itemClicked />
</aside>
