import { redirect, type Actions, fail } from '@sveltejs/kit';

export async function load({ parent, locals: { supabase } }) {
	const { session } = await parent();

	if (!session) {
		throw redirect(303, '/signin');
	}

	const { data } = await supabase
		.from('profiles')
		.select('name')
		.eq('id', session.user.id)
		.single();

	return {
		profile: data
	};
}

export const actions: Actions = {
	update: async ({ request, locals: { supabase, getSession } }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;

		if (!name.trim()) {
			return fail(400, { error: 'Name cannot be empty.' });
		}

		const session = await getSession();

		if (!session) {
			return fail(401, { error: 'Not authenticated.' });
		}

		const { error } = await supabase.from('profiles').update({ name }).eq('id', session.user.id);

		if (error) {
			return fail(500, { error: 'Server error. Try again later.' });
		}

		return {
			message: 'Profile updated successfully.'
		};
	}
};
