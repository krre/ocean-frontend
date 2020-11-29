<script lang="ts">
    export let baseRoute = "";
    export let baseQuery = new URLSearchParams();
    export let pageQuery = new URLSearchParams();
    export let limit = 1;
    export let count = 1;
    export let offset = 1;
    let pages = [];

    $: last = Math.ceil(count / limit);
    $: pageQuery = query(offset);
    $: {
        const maxPageSelectors = 5;
        pages = Array(Math.min(last, maxPageSelectors));

        pages[0] = 1;
        pages[pages.length - 1] = last;

        let start = 2;

        if (pages.length == maxPageSelectors && offset >= 4) {
            if (last - offset <= 3 && offset > last - 3) {
                start = last - 3;
            } else if (offset >= 4) {
                start = offset - 1;
            }
        }

        for (let i = 0; i < pages.length - 2; i++) {
            pages[i + 1] = start + i;
        }

        pages = pages;
    }

    function query(page: number, qry?: URLSearchParams): URLSearchParams {
        let result = new URLSearchParams(qry);

        if (page <= 1) {
            return result;
        }

        result.append("page", page.toString());
        return result;
    }

    function makeLink(page: number, qry: URLSearchParams): string {
        let params = query(page, qry).toString();
        return baseRoute + (params ? "?" + params : "");
    }
</script>

<style>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        margin-bottom: var(--page-margin);
    }

    span {
        width: 2em;
        padding: 0.7em;
        border-top: var(--border-1px);
        border-bottom: var(--border-1px);
        border-left: var(--border-1px);
    }

    span:last-child {
        border-right: var(--border-1px);
    }

    .offset {
        background-color: powderblue;
    }
</style>

{#if count > limit}
    <div class="container">
        {#each pages as p}
            <span class:offset={offset == p}><a
                    href={makeLink(p, baseQuery)}>{p}</a></span>
        {/each}
    </div>
{/if}
