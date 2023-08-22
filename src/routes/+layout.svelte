<script>
	import { locale, locale2Emoji } from '$lib/i18n';
	import '../app.css';
	import { t } from '$lib/i18n';

	export let data;
</script>

<div class="h-screen overflow-hidden flex flex-col bg-base-300">
	<div class="navbar shadow bg-base-100 flex justify-between">
		<a href="/" class="btn btn-ghost normal-case text-xl">Ruta Dinamica</a>
		<div>
			<select bind:value={$locale} class="select w-full max-w-xs mr-2">
				{#each Object.entries(locale2Emoji) as [l, emoji]}
					<option value={l}>
						{emoji}
					</option>
				{/each}
			</select>
			{#if data.session}
				<div class="dropdown dropdown-end">
					<button type="button" tabindex="0" class="btn btn-ghost btn-circle avatar">
						<div class="w-10 rounded-full">
							<img
								alt="placeholder profile"
								src={data.profile.avatar_url ? data.profile.avatar_url : '/placeholder-profile.png'}
							/>
						</div>
					</button>
					<ul
						class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
					>
						<li><a href="/profile">{$t('profile')}</a></li>
						<li>
							<a href="/signout">{$t('signOut')}</a>
						</li>
					</ul>
				</div>
			{:else}
				<a href="/signin" class="btn btn-primary">{$t('signIn')}</a>
			{/if}
		</div>
	</div>

	<slot />
</div>
