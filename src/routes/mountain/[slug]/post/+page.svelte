<script lang="ts">
	import { enhance } from '$app/forms';
	import { t } from '$lib/i18n';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';

	export let form;
	export let data;
	let { supabase, session } = data;

	let loading = false;
	let error: string | null = null;
	$: if (form?.error) {
		error = form.error;
	}
	let files: FileList | null = null;
	let preloadLinks: string[] = [];

	function onFilesChange() {
		if (!files || files?.length === 0) {
			return;
		}

		for (const file of files) {
			preloadLinks.push(URL.createObjectURL(file));
		}
		preloadLinks = [...preloadLinks];
	}

	const submit: SubmitFunction = async ({ cancel, formData }) => {
		loading = true;

		const images = files;

		if (images && images.length > 0) {
			for (const image of images) {
				const { error: imageErr, data: imageData } = await data
					.supabase!.storage.from('images')
					.upload(`${session.user.id}/${uuidv4()}`, image);

				if (imageErr) {
					error = imageErr.message;
					loading = false;
					cancel();
					return;
				}

				formData.append('image_urls', imageData.path);
				formData.delete('image');
			}
		}

		return async ({ update }) => {
			await update();
			loading = false;
		};
	};

	onMount(() => {
		return () => {
			for (const preloadLink of preloadLinks) {
				URL.revokeObjectURL(preloadLink);
			}
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
	<div class="carousel rounded-box shadow max-w-sm shrink-0 max-h-[30rem]">
		{#if preloadLinks.length === 0}
			<div class="carousel-item w-full">
				<img class="object-cover w-full" src="/mountain.png" alt="Mountain placeholder" />
			</div>
		{:else}
			{#each preloadLinks as preloadLink}
				<div class="carousel-item w-full">
					<img class="object-cover w-full" src={preloadLink} alt="post" />
				</div>
			{/each}
		{/if}
	</div>
	<input
		type="file"
		class="shrink-0 file-input w-full file-input-secondary"
		accept="image/*"
		name="image"
		bind:files
		on:change={onFilesChange}
		multiple
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
