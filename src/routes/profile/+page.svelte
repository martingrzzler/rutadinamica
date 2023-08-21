<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { onMount } from 'svelte';

	export let data;
	export let form;

	let { supabase, session } = data;

	let loading = false;
	let error: string | null = null;
	$: if (form?.error) {
		error = form.error;
	}

	let preloadLink = '';
	let files: FileList | null = null;
	let userName = data.profile?.name || '';
	let whatsapp = data.profile?.whatsapp || '';

	function onFileChange() {
		if (files?.length === 0) {
			return;
		}
		const file = files![0];
		preloadLink = URL.createObjectURL(file);
	}

	const submit: SubmitFunction = async ({ cancel, formData }) => {
		loading = true;

		const avatar = files?.item(0);

		if (avatar?.size) {
			const { error: uploadErr, data: uploadData } = await data.supabase.storage
				.from('images')
				.upload(`${session.user.id}/avatar.${avatar.name.split('.').at(-1)}`, avatar, {
					upsert: true
				});

			if (uploadErr) {
				error = uploadErr.message;
				loading = false;
				cancel();
				return;
			}

			formData.set('avatar_url', uploadData.path);
			formData.delete('avatar');
		}

		return async ({ update }) => {
			await update({
				reset: false
			});

			loading = false;
		};
	};

	onMount(() => {
		return () => {
			URL.revokeObjectURL(preloadLink);
		};
	});
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
	<img
		class="rounded-xl shadow w-full max-w-sm max-h-96 object-cover"
		src={preloadLink
			? preloadLink
			: data.profile?.avatar_url
			? data.profile?.avatar_url
			: 'placeholder-profile.png'}
		alt="Profile"
	/>
	<form
		enctype="multipart/form-data"
		class="flex flex-col items-center gap-4"
		action="?/update"
		use:enhance={submit}
		method="POST"
	>
		<input
			type="file"
			class="file-input w-full file-input-secondary max-w-xs"
			accept="image/*"
			name="avatar"
			bind:files
			on:change={onFileChange}
			disabled={loading}
		/>
		<input
			disabled={loading}
			placeholder="Add your name"
			class="input w-full max-w-xs"
			type="text"
			name="name"
			bind:value={userName}
		/>
		<input
			disabled={loading}
			placeholder="WhatsApp number (optional)"
			class="input w-full max-w-xs"
			type="text"
			name="whatsapp"
			bind:value={whatsapp}
		/>
		<button class="btn btn-primary min-w-[10rem]" disabled={loading}>
			{#if loading}
				<span class="loading loading-ring loading-lg" />
			{:else}
				Update
			{/if}
		</button>
	</form>
</div>
