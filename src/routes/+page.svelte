<script>
	export let data;
</script>

<div class="flex flex-col gap-4 flex-grow overflow-hidden items-center">
	<h1 class="text-center">
		Find current conditions of the mountains in the Cordillera Blanca posted by fellow climbers.
	</h1>
	<input
		type="text"
		placeholder="Search mountain..."
		class="input input-bordered w-full max-w-xs"
	/>
	<div class="flex flex-wrap gap-4 flex-grow overflow-auto px-7">
		{#each data.mountains as mountain}
			<div class="card w-96 bg-base-100 shadow-xl">
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
			</div>
		{/each}
	</div>
</div>
