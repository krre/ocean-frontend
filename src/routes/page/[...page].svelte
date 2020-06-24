<script context="module">
    export function preload({ params }) {
        const result = {
            currentPage: +params.page[0]
        };

        if (params.page.length == 2) {
            result.filter = +params.page[1];
        }

        if (params.page.length == 3) {
            result.currentCategory = +params.page[2];
        }

        return result;
    }
</script>

<script>
    import Home from "../../components/Home.svelte";
    export let currentPage;
    export let filter = 0;
    export let currentCategory = 0;
</script>

<Home {currentPage} {filter} {currentCategory} />
