<script context="module">
    export function preload({ params }) {
        return {
            currentPage: +params.page[0],
            filter: +params.page[1]
        };
    }
</script>

<script>
    import Home from "../../components/Home.svelte";
    export let currentPage;
    export let filter;
</script>

<Home {currentPage} {filter} />
