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
		const date = formData.get('date') as string;
		const image = formData.get('image') as File;

		if (content.trim() === '') {
			return fail(400, { error: 'Content cannot be empty' });
		}

		if (route.trim() === '') {
			return fail(400, { error: 'Route cannot be empty' });
		}

		if (date.trim() === '' || isNaN(Date.parse(date))) {
			return fail(400, { error: 'Date cannot be empty' });
		}

		const slug = params.slug;

		const { data: mountain, error } = await supabase
			.from('mountains')
			.select('id')
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

		let image_url: string | undefined = undefined;

		if (image) {
			const { error, data } = await supabase.storage
				.from('images')
				.upload(`${session.user.id}/${image.name}`, image);

			if (error) {
				console.log(error);
				return fail(500, { error: 'Server error. Try again later.' });
			}

			image_url = data.path;
		}

		const { error: error2 } = await supabase.from('posts').insert({
			mountain_id: mountain.id,
			profile_id: profile.id,
			content,
			route,
			date,
			image_url
		});

		if (error2) {
			return fail(500, { error: 'Server error. Try again later.' });
		}

		throw redirect(303, `/mountain/${slug}`);
	}
};
