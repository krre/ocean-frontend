<svelte:head>
	<title>Добавить манделу</title>
</svelte:head>

<script>
	import * as sapper from '@sapper/app' 

	async function append()  {
		const response = await fetch('http://localhost:11000/append');
		const result = await response.text();
		console.log(result);
		// sapper.goto('/');
	}
</script>

<h1>Добавить манделу</h1>

<input type="text">
<button on:click={append}>Добавить</button>
