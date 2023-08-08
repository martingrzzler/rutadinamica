export async function load({ locals: { supabase }, params }) {
	const { slug } = params;

	const { data } = await supabase
		.from('mountains')
		.select('id, name, slug, cover_image_url')
		.eq('slug', slug);

	return {
		mountain: data?.[0]
	};
}
