import { supabase } from '$lib/db';

export async function load({ params }) {
	const { slug } = params;

	const { data } = await supabase
		.from('mountains')
		.select('id, name, slug, cover_image_url')
		.eq('slug', slug);

	return {
		mountain: data?.[0]
	};
}
