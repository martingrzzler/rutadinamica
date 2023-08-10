<script lang="ts">
	import { page, updated } from '$app/stores';
	import Add from '$lib/icons/Add.svelte';
	import { format } from 'timeago.js';

	export let data;

	function getUserInitials(name: string): string {
		const names = name.split(' ');

		if (names.length === 1) {
			return names[0].charAt(0);
		}

		return names[0].charAt(0) + names[names.length - 1].charAt(0);
	}
</script>

<div class="px-7 py-4 flex gap-4 flex-col items-center flex-grow overflow-hidden">
	<div>
		<figure>
			<img
				class="object-cover w-full h-52 rounded-xl shadow"
				src={data.mountain.cover_image_url}
				alt={`Mountain ${data.mountain.name}`}
			/>
		</figure>
	</div>
	<h2 class="card-title">{data.mountain.name}</h2>
	<a
		href={$page.url.pathname + '/post'}
		class="btn btn-secondary flex items-center self-end max-w-[10rem]"
	>
		<div>Post</div>
		<Add className="w-5 h-5 -translate-y-[1px]" />
	</a>
	<div class="flex-grow overflow-auto self-stretch">
		{#each data.posts as post}
			<div class="collapse bg-base-100 mt-4">
				<input type="checkbox" />
				<div class="collapse-title w-full flex justify-between items-center px-4">
					<div class="text-lg font-medium">{post.route}</div>
					<div class="flex gap-2 items-center">
						<div class="text-sm">
							{format(post.updated_at, 'en_US')}
						</div>
						<div class="avatar placeholder">
							{#if post.profiles.avatar_url}
								<div class="w-12 rounded-full">
									<img
										class="object-cover"
										src={post.profiles.avatar_url}
										alt={post.profiles.name}
									/>
								</div>
							{:else}
								<div class="bg-neutral-focus text-neutral-content rounded-full w-12">
									<span class="uppercase">{getUserInitials(post.profiles.name || 'Anonomous')}</span
									>
								</div>
							{/if}
						</div>
					</div>
				</div>
				<div class="collapse-content">
					<p class="whitespace-pre-wrap">
						{post.content}
					</p>
				</div>
			</div>
		{/each}
	</div>
</div>
