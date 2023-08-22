<script lang="ts">
	import { enhance } from '$app/forms';
	import { t } from '$lib/i18n';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { onMount } from 'svelte';

	export let form;
	export let data;
	let { supabase, session } = data;

	let loading = false;
	let error: string | null = null;
	$: if (form?.error) {
		error = form.error;
	}
	let files: FileList | null = null;
	let preloadLink = '';

	function onFileChange() {
		if (files?.length === 0) {
			return;
		}
		const file = files![0];
		preloadLink = URL.createObjectURL(file);
	}

	const submit: SubmitFunction = async ({ cancel, formData }) => {
		loading = true;

		const image = files?.item(0);

		if (image?.size) {
			const { error: uploadErr, data: uploadData } = await data.supabase.storage
				.from('images')
				.upload(`${session.user.id}/${image.name}`, image);

			if (uploadErr) {
				error = uploadErr.message;
				loading = false;
				cancel();
				return;
			}

			formData.set('image_url', uploadData.path);
			formData.delete('image');
		}

		return async ({ update }) => {
			await update();
			loading = false;
		};
	};

	onMount(() => {
		return () => {
			URL.revokeObjectURL(preloadLink);
		};
	});
</script>

<form
	enctype="multipart/form-data"
	method="POST"
	use:enhance={submit}
	class="px-7 flex flex-col items-center gap-4 mt-4 overflow-auto flex-1 pb-10"
>
	{#if error}
		<div class="alert alert-error">
			{error}
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
		placeholder={$t('mountain.post.route')}
		class="input shrink-0 w-full"
		type="text"
		name="route"
		required
	/>
	<input
		disabled={loading}
		placeholder={$t('mountain.post.date')}
		on:focus={function () {
			this.type = 'date';
		}}
		class="input shrink-0 w-full"
		type="text"
		name="date"
		required
	/>
	<textarea
		disabled={loading}
		class="textarea shrink-0 w-full"
		rows="10"
		name="content"
		placeholder={$t('mountain.post.content')}
		required
	/>
	<button disabled={loading} class="btn btn-primary min-w-[10rem]">
		{#if loading}
			<span class="loading loading-ring loading-lg" />
		{:else}
			{$t('post')}
		{/if}
	</button>
</form>
