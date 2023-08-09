<script>
	import { page } from '$app/stores';
	import Add from '$lib/icons/Add.svelte';
	import { format } from 'timeago.js';
</script>

<div class="px-7 py-4 flex gap-4 flex-col items-center">
	<a
		href={$page.url.pathname + '/post'}
		class="btn btn-secondary flex items-center self-end max-w-[10rem]"
	>
		<div>Post</div>
		<Add className="w-5 h-5 -translate-y-[1px]" />
	</a>

	<div>
		<div class="collapse bg-base-100">
			<input type="checkbox" />
			<div class="collapse-title flex justify-between items-center px-4">
				<div class="text-lg font-medium">French Direct</div>
				<div class="flex gap-2 items-center">
					<div class="text-sm">
						{format(Date.now(), 'en_US')}
					</div>
					<div class="avatar placeholder">
						<div class="bg-neutral-focus text-neutral-content rounded-full w-8">
							<span class="text-xs">KT</span>
						</div>
					</div>
				</div>
			</div>
			<div class="collapse-content">
				<p>
					Alpamayo French Direct conditions looking great today! Clear skies, light snow, and good
					ice. Perfect day to climb.
				</p>
			</div>
		</div>
	</div>
</div>
