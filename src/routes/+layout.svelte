<script>
	import '../app.css';

	export let data;
	console.log(data);
</script>

<div class="h-screen overflow-hidden flex flex-col bg-base-300">
	<div class="navbar shadow bg-base-100 flex justify-between">
		<a href="/" class="btn btn-ghost normal-case text-xl">Ruta Dinamica</a>
		{#if data.session}
			<div>
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
						<li><a href="/profile">Profile</a></li>
						<li>
							<a href="/signout">Sign out</a>
						</li>
					</ul>
				</div>
			</div>
		{:else}
			<a href="/signin" class="btn btn-primary">Sign in</a>
		{/if}
	</div>

	<slot />
</div>
