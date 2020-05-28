<script>
    import Nav from "../components/Nav.svelte";

    export let segment;
</script>

<style>
    p {
        color: white;
        background-color: red;
        height: 50px;
        text-align: center;
        line-height: 50px;
    }
</style>

<p>
    Сайт находится в разработке! Возможны перебои в работе и полное удаление
    всех данных!
</p>
<Nav {segment} />

<main>
    <slot />
</main>
