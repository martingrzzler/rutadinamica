import { error } from '@sveltejs/kit';

interface Post {
	id: string;
	content: string;
	route: string;
	updated_at: string;
	date: string;
	image_urls?: string[];
	profiles: {
		name?: string;
		avatar_url?: string;
		whatsapp?: string;
	};
}

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
		date,
		image_urls,
		profiles (
			name,
			avatar_url,
			whatsapp
		)`
		)
		.eq('mountain_id', mountain.id)
		.order('updated_at', { ascending: false })
		.returns<Post[]>();

	if (err) {
		console.log(err);
		throw error(500, err.message);
	}

	const postsWithPublicUrl = posts.map((post: Post) => {
		let avatar_url;
		let image_urls;

		if (post.profiles.avatar_url) {
			const {
				data: { publicUrl }
			} = supabase.storage.from('images').getPublicUrl(post.profiles.avatar_url);

			avatar_url = publicUrl;
		}

		if (post.image_urls) {
			image_urls = post.image_urls.map((image_url) => {
				const {
					data: { publicUrl }
				} = supabase.storage.from('images').getPublicUrl(image_url);

				return publicUrl;
			});
		}

		return {
			...post,
			image_urls,
			profiles: {
				...post.profiles,
				avatar_url
			}
		};
	});

	return {
		mountain,
		posts: postsWithPublicUrl
	};
}
