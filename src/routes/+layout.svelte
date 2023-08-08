<script>
	import '../app.css';

	export let data;
</script>

<div class="h-screen overflow-hidden flex flex-col bg-base-300">
	<div class="navbar shadow bg-base-100 flex justify-between">
		<a href="/" class="btn btn-ghost normal-case text-xl">Ruta Dinamica</a>
		{#if data.session}
			<a href="/signout" class="btn btn-primary">Sign out</a>
		{:else}
			<a href="/signin" class="btn btn-primary">Sign in</a>
		{/if}
	</div>

	<slot />
</div>
