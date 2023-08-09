<script>
	import { enhance } from '$app/forms';

	export let form;

	let loading = false;
</script>

<form
	method="POST"
	use:enhance={() => {
		loading = true;

		return async ({ update }) => {
			await update();
			loading = false;
		};
	}}
	class="px-7 flex flex-col items-center gap-4 mt-4"
>
	{#if form?.error}
		<div class="alert alert-error">
			{form.error}
		</div>
	{/if}
	<input
		disabled={loading}
		placeholder="Which route did you climb?"
		class="input w-full"
		type="text"
		name="route"
	/>
	<textarea
		disabled={loading}
		class="textarea w-full"
		rows="10"
		name="content"
		placeholder="Post your experience"
	/>
	<button class="btn btn-primary min-w-[10rem]">
		{#if loading}
			<span class="loading loading-ring loading-lg" />
		{:else}
			Post
		{/if}
	</button>
</form>
