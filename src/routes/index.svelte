<script>
    import { onMount } from "svelte";
    import { Request } from "../js/json-rpc.js";
    let topics = [];

    onMount(async () => {
        let request = new Request("topic.get");

        const response = await fetch("http://localhost:21000/dive", {
            method: "POST",
            body: request.toString()
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
