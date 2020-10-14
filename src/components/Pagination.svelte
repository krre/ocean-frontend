<script lang="ts">
    export let currentCount = 0;
    export let pageLimit = 0;
    export let pageNo = 1;
    export let lastPage = 1;

    export let firstPageLink: string;
    export let prevPageLink: string;
    export let nextPageLink: string;
    export let lastPageLink: string;
</script>

<style>
    .pagination-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
        margin: 0 -5px;
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

{#if currentCount && currentCount > pageLimit}
    <div class="pagination-container">
        {#if pageNo > 1}
            <a class="pagination-item" href={firstPageLink}>Первая</a>
            <a class="pagination-item" href={prevPageLink}>Предыдущая</a>
        {/if}

        <div class="pagination-item">{pageNo}</div>

        {#if pageNo < lastPage}
            <a class="pagination-item" href={nextPageLink}>Следующая</a>
            <a class="pagination-item" href={lastPageLink}>Последняя</a>
        {/if}
    </div>
{/if}
