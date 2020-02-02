<svelte:head>
	<title>Добавить манделу</title>
</svelte:head>

<script>
	import * as sapper from '@sapper/app' 

	let title = '';

	async function append()  {
		const topic = {
			title: title
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

<input bind:value={title} type="text">
<button on:click={append}>Добавить</button>
