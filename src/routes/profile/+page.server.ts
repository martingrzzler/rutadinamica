import { redirect, type Actions, fail } from '@sveltejs/kit';

export async function load({ parent, locals: { supabase } }) {
	const { session } = await parent();

	if (!session) {
		throw redirect(303, '/signin');
	}

	const { data, error } = await supabase
		.from('profiles')
		.select('name, avatar_url')
		.eq('id', session.user.id)
		.single();

	if (error) {
		return fail(500, { error: 'Server error. Try again later.' });
	}

	if (data.avatar_url) {
		return {
			profile: {
				name: data.name,
				avatar_url: supabase.storage.from('images').getPublicUrl(data.avatar_url).data.publicUrl
			}
		};
	}

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

		const avatar = formData.get('avatar') as File | undefined;
		let avatar_url: string | undefined = undefined;

		if (avatar) {
			const { error, data } = await supabase.storage
				.from('images')
				.upload(`${session.user.id}/avatar`, avatar, {
					upsert: true
				});

			if (error) {
				console.log(error);
				return fail(500, { error: 'Server error. Try again later.' });
			}

			avatar_url = data.path;
		}

		const { error } = await supabase
			.from('profiles')
			.update({ name, avatar_url })
			.eq('id', session.user.id);

		if (error) {
			return fail(500, { error: 'Server error. Try again later.' });
		}

		return {
			message: 'Profile updated successfully.'
		};
	}
};
