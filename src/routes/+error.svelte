<script>
	import { page } from '$app/stores';
</script>

<div class="flex flex-col items-center mt-4 gap-4">
	<h1 class="text-xl font-semibold text-accent">Oops, something went wrong...</h1>
	<h1 class="text-xl">{$page.status}</h1>
	<p class="text-center text-sm text-neutral-500">{$page.error?.message}</p>
</div>
