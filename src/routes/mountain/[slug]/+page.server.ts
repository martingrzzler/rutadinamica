import { error } from '@sveltejs/kit';

interface Post {
	id: string;
	content: string;
	route: string;
	updated_at: string;
	profiles: {
		name?: string;
		avatar_url?: string;
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
		profiles (
			name,
			avatar_url
		)
		`
		)
		.eq('mountain_id', mountain.id)
		.order('updated_at', { ascending: false })
		.returns<Post[]>();

	if (err) {
		console.log(err);
		throw error(500, err.message);
	}

	const postsWithPublicUrl = posts.map((post: Post) => {
		if (!post.profiles.avatar_url) {
			return post;
		}
		const {
			data: { publicUrl }
		} = supabase.storage.from('images').getPublicUrl(post.profiles.avatar_url);

		return {
			...post,
			profiles: {
				...post.profiles,
				avatar_url: publicUrl
			}
		};
	});

	return {
		mountain,
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		posts: postsWithPublicUrl
	};
}
