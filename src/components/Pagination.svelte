<script lang="ts">
    export let baseRoute = "";
    export let baseQuery: URLSearchParams;
    export let pageQuery: URLSearchParams;
    export let limit = 0;
    export let count = 0;
    export let offset = 1;

    $: last = Math.ceil(count / limit);
    $: pageQuery = query(offset);

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
    .pagination-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 0.7em;
    }

    .pagination-item {
        padding: 0 5px;
        text-decoration: none;
        color: rgb(51, 51, 51);
    }

    .pagination-item:hover {
        text-decoration: underline;
    }
</style>

{#if count > limit}
    <div class="pagination-container">
        {#if offset > 1}
            <a class="pagination-item" href={makeLink(1, baseQuery)}>Первая</a>
            <a
                class="pagination-item"
                href={makeLink(offset - 1, baseQuery)}>Предыдущая</a>
        {/if}

        <div class="pagination-item">{offset}</div>

        {#if offset < last}
            <a
                class="pagination-item"
                href={makeLink(offset + 1, baseQuery)}>Следующая</a>
            <a
                class="pagination-item"
                href={makeLink(last, baseQuery)}>Последняя</a>
        {/if}
    </div>
{/if}
