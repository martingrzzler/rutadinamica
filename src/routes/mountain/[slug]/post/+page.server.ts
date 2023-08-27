import { fail, type Actions, redirect } from '@sveltejs/kit';

export async function load({ locals: { getSession } }) {
	const session = await getSession();

	if (!session) {
		throw redirect(303, '/signin');
	}

	return {
		session
	};
}

interface Update {
	mountain_id: string;
	profile_id: string;
	content: string;
	route: string;
	date: string;
	image_urls?: string[];
}

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
		const image_urls = formData.getAll('image_urls') as string[] | undefined;

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

		const update: Update = {
			mountain_id: mountain.id,
			profile_id: profile.id,
			content,
			route,
			date
		};

		if (image_urls) {
			update.image_urls = image_urls;
		}

		const { error: error2 } = await supabase.from('posts').insert(update);

		if (error2) {
			return fail(500, { error: 'Server error. Try again later.' });
		}

		throw redirect(303, `/mountain/${slug}`);
	}
};
