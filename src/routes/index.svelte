<script>
    import { onMount } from "svelte";
    import { Request } from "../js/json-rpc.js";
    import { sendRequest } from "../js/net.js";
    let topics = [];

    onMount(async () => {
        topics = await sendRequest(new Request("topic.get"));
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
