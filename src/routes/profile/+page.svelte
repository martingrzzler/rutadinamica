<script>
	import { enhance } from '$app/forms';

	export let data;
	export let form;

	let loading = false;
</script>

<div class="flex flex-col items-center py-6 px-7 gap-4">
	{#if form?.error}
		<div class="alert alert-error">
			{form.error}
		</div>
	{/if}

	{#if form?.message}
		<div class="alert alert-success">
			{form?.message}
		</div>
	{/if}

	<form
		class="flex flex-col items-center gap-4"
		action="?/update"
		use:enhance={() => {
			loading = true;

			return async ({ update }) => {
				await update();
				loading = false;
			};
		}}
		method="POST"
	>
		<input
			disabled={loading}
			value={data.profile.name || ''}
			placeholder="Add your name"
			class="input w-full max-w-xs"
			type="text"
			name="name"
		/>
		<button class="btn btn-primary min-w-[10rem]">
			{#if loading}
				<span class="loading loading-ring loading-lg" />
			{:else}
				Update
			{/if}
		</button>
	</form>
</div>
