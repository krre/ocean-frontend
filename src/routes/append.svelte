<svelte:head>
	<title>Добавить манделу</title>
</svelte:head>

<style>
	.column {
		display: grid;
		grid-gap: 10px;
	}

	.append-item {
		margin-top: 10px
	}
</style>

<script>
	import * as sapper from '@sapper/app' 

	let title = '';
	let description = '';

	async function append()  {
		const topic = {
			title: title,
			description: description
		};

		const response = await fetch('http://localhost:11000/append', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(topic)
		});

		const result = await response.text();
		console.log(result);
		// sapper.goto('/');
	}
</script>

<h1>Добавить манделу</h1>

<div class="column">
	Заголовок:
	<input bind:value={title} type="text">
	Описание:
	<textarea rows="10" bind:value={description}></textarea>
</div>

<button class="append-item" on:click={append}>Отправить</button>
