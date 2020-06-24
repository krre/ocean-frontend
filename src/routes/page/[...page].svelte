<script context="module">
    export function preload({ params }) {
        const currentPage = +params.page[0];
        const filter = params.page.length == 2 ? +params.page[1] : 0;
        const currentCategory = params.page.length == 3 ? +params.page[2] : 0;

        return { currentPage, filter, currentCategory };
    }
</script>

<script>
    import Home from "../../components/Home.svelte";
    export let currentPage;
    export let filter = 0;
    export let currentCategory = 0;
</script>

<Home {currentPage} {filter} {currentCategory} />
