<script>
    import * as sapper from "@sapper/app";

    let title = "";
    let description = "";

    async function append() {
        if (!title) {
            alert("Заголовок не заполнен!");
            return;
        }

        if (!description) {
            alert("Описание не заполнено!");
            return;
        }

        let request = {
            method: "topic.create",
            id: "42",
            params: {
                title: title,
                description: description
            }
        };

        const response = await fetch("http://localhost:21000/dive", {
            method: "POST",
            body: JSON.stringify(request)
        });

        const result = await response.text();
        console.log(result);
    }
</script>

<style>
    .column {
        display: grid;
        grid-gap: 10px;
    }

    .append-item {
        margin-top: 10px;
    }
</style>

<svelte:head>
    <title>Добавить манделу</title>
</svelte:head>
<h1>Добавить манделу</h1>

<div class="column">
    Заголовок:
    <input bind:value={title} type="text" />
    Описание:
    <textarea rows="10" bind:value={description} />
</div>

<button class="append-item" on:click={append}>Отправить</button>
