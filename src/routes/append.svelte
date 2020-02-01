<svelte:head>
	<title>Добавить манделу</title>
</svelte:head>

<script>
	import * as sapper from '@sapper/app' 

	function append() {
		sapper.goto('/')
	}
</script>

<h1>Добавить манделу</h1>

<input type="text">
<button on:click={append}>Добавить</button>
