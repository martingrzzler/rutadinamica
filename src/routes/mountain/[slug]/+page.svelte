<script lang="ts">
	import { page } from '$app/stores';
	import { locale, t } from '$lib/i18n';
	import Add from '$lib/icons/Add.svelte';
	import Summit from '$lib/icons/Summit.svelte';
	import WhatsApp from '$lib/icons/WhatsApp.svelte';
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
	<h2 class="card-title">{data.mountain.name}</h2>
	<a
		href={$page.url.pathname + '/post'}
		class="btn btn-secondary flex items-center self-end max-w-[10rem]"
	>
		<div>{$t('post')}</div>
		<Add className="w-5 h-5 -translate-y-[1px]" />
	</a>
	<div class="flex-grow overflow-auto self-stretch pb-12">
		{#each data.posts as post}
			<div class="collapse bg-base-100 mt-4 max-w-xl mx-auto">
				<input type="checkbox" />
				<div class="collapse-title w-full flex justify-between items-center px-4">
					<div class="text-lg font-medium">{post.route}</div>
					<div class="flex gap-2 items-center">
						<div class="text-sm">
							{format(post.updated_at, $locale)}
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
					{#if post.profiles.whatsapp}
						<div class="flex justify-end">
							<a class="btn mb-3 ml-auto" href={`tel:${post.profiles.whatsapp}`}>
								<WhatsApp className={'w-6 h-6'} />
								{$t('mountain.contact', {
									name: post.profiles.name ? post.profiles.name.split(' ')[0] : 'Me'
								})}
							</a>
						</div>
					{/if}
					<div class="flex gap-2 mb-3 text-gray-600">
						<Summit className="w-5 h-5 fill-gray-600" />
						<p>{format(post.date, $locale)}</p>
					</div>
					{#if post.image_urls}
						<div class="carousel rounded-box shadow max-w-sm shrink-0 max-h-[30rem]">
							{#each post.image_urls as imageUrl}
								<div class="carousel-item w-full">
									<img class="object-cover w-full" src={imageUrl} alt="post" />
								</div>
							{/each}
						</div>
					{/if}
					<p class="whitespace-pre-wrap">
						{post.content}
					</p>
				</div>
			</div>
		{/each}
	</div>
</div>
