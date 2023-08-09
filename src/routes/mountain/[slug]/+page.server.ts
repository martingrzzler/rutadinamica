import { error } from '@sveltejs/kit';

export async function load({ locals: { supabase }, params }) {
	const { slug } = params;

	const { data: mountain } = await supabase
		.from('mountains')
		.select('id, name, slug, cover_image_url')
		.eq('slug', slug)
		.single();

	if (!mountain) {
		throw error(404, `Mountain ${slug} not found`);
	}

	const { data: posts, error: err } = await supabase
		.from('posts')
		.select(
			`
		id,
		content,
		route,
		updated_at,
		profiles (
			name
		)
		`
		)
		.eq('mountain_id', mountain.id)
		.order('updated_at', { ascending: false });

	if (err) {
		console.log(err);
		throw error(500, err.message);
	}

	return {
		mountain,
		posts
	};
}
