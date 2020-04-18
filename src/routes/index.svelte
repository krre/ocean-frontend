<script>
    import { onMount } from "svelte";
    let topics = [];

    onMount(async () => {
        let request = {
            method: "topic.get",
            id: "42"
        };

        const response = await fetch("http://localhost:21000/dive", {
            method: "POST",
            body: JSON.stringify(request)
        });

        topics = await response.json();
        console.log(topics);
    });
</script>

<style>

</style>

<svelte:head>
    <title>Океан. Каталог фактов эффекта Манделы</title>
</svelte:head>

<h1>Каталог</h1>
Скоро всё будет...
