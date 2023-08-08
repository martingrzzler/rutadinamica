<script>
	import { enhance } from '$app/forms';

	export let form;
</script>

<div class="flex flex-col items-center py-10 gap-4 px-7">
	{#if form?.success}
		<div class="alert alert-success">
			Success! {form.message}
		</div>
	{:else}
		{#if form?.error}
			<div class="alert alert-error">
				{form.error}
			</div>
		{/if}
		<form method="POST" class="flex flex-col items-center gap-4" use:enhance>
			<input
				value={form?.email ?? ''}
				placeholder="Your Email"
				class="input w-full max-w-xs"
				type="email"
				name="email"
			/>
			<button type="submit" class="btn btn-primary">Receive Link</button>
		</form>
	{/if}
</div>
