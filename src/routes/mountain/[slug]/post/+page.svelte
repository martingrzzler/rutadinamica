<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	export let form;

	let loading = false;
	let files: FileList | null = null;
	let preloadLink = '';

	function onFileChange() {
		if (files?.length === 0) {
			return;
		}
		const file = files![0];
		preloadLink = URL.createObjectURL(file);
	}

	onMount(() => {
		return () => {
			URL.revokeObjectURL(preloadLink);
		};
	});
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
	class="px-7 flex flex-col items-center gap-4 mt-4 overflow-auto flex-1 pb-10"
>
	{#if form?.error}
		<div class="alert alert-error">
			{form.error}
		</div>
	{/if}
	<img
		class="rounded-xl shadow w-full max-w-sm max-h-96 object-cover"
		src={preloadLink ? preloadLink : '/mountain.png'}
		alt="Mountain placeholder"
	/>
	<input
		type="file"
		class="shrink-0 file-input w-full file-input-secondary"
		accept="image/*"
		name="image"
		bind:files
		on:change={onFileChange}
		disabled={loading}
	/>
	<input
		disabled={loading}
		placeholder="Which route did you climb?"
		class="input shrink-0 w-full"
		type="text"
		name="route"
		required
	/>
	<input
		disabled={loading}
		placeholder="When did you climb it?"
		class="input shrink-0 w-full"
		type="date"
		name="date"
		required
	/>
	<textarea
		disabled={loading}
		class="textarea shrink-0 w-full"
		rows="10"
		name="content"
		placeholder="Post your experience"
		required
	/>
	<button class="btn btn-primary min-w-[10rem]">
		{#if loading}
			<span class="loading loading-ring loading-lg" />
		{:else}
			Post
		{/if}
	</button>
</form>
