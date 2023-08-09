import { fail, type Actions, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, params, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();

		const content = formData.get('content') as string;
		const route = formData.get('route') as string;

		if (content.trim() === '') {
			return fail(400, { error: 'Content cannot be empty' });
		}

		if (route.trim() === '') {
			return fail(400, { error: 'Route cannot be empty' });
		}

		const slug = params.slug;

		const { data, error } = await supabase
			.from('mountains')
			.select('id, name, slug, cover_image_url')
			.eq('slug', slug)
			.single();

		if (error) {
			return fail(500, { error: `Mountain ${slug} not found` });
		}

		const { data: profile } = await supabase
			.from('profiles')
			.select('id')
			.eq('id', session.user.id)
			.single();

		if (!profile) {
			return fail(401, { error: 'Unauthorized' });
		}

		const { error: error2 } = await supabase.from('posts').insert({
			mountain_id: data.id,
			profile_id: profile.id,
			content,
			route
		});

		if (error2) {
			return fail(500, { error: 'Server error. Try again later.' });
		}

		throw redirect(303, `/mountain/${slug}`);
	}
};
