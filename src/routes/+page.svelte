<script>
	export let data;

	let search = '';
	$: filteredMountains =
		search !== ''
			? data.mountains.filter((mountain) => {
					return mountain.name.toLowerCase().includes(search.toLowerCase());
			  })
			: data.mountains;
</script>

<div class="flex flex-col gap-4 flex-grow overflow-hidden items-center">
	<h1 class="text-center">
		Find current conditions of the mountains in the Cordillera Blanca posted by fellow climbers.
	</h1>
	<input
		type="text"
		bind:value={search}
		placeholder="Search mountain..."
		class="input input-bordered w-full max-w-xs"
	/>
	<div class="flex flex-wrap gap-4 flex-grow overflow-auto px-8 pb-10">
		{#each filteredMountains as mountain}
			<a href={`/mountain/${mountain.slug}`} class="card w-96 h-96 bg-base-100 shadow-xl">
				<figure>
					<img
						class="object-cover w-full h-72"
						src={mountain.cover_image_url}
						alt={`Mountain ${mountain.name}`}
					/>
				</figure>
				<div class="card-body">
					<h2 class="card-title">{mountain.name}</h2>
				</div>
			</a>
		{/each}
	</div>
</div>
