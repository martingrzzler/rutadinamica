import { redirect, type Actions, fail } from '@sveltejs/kit';

export async function load({ locals: { supabase, getSession } }) {
	const session = await getSession();

	if (!session) {
		throw redirect(303, '/signin');
	}

	const { data, error } = await supabase
		.from('profiles')
		.select('name, avatar_url, whatsapp')
		.eq('id', session.user.id)
		.single();

	if (error) {
		return fail(500, { error: 'Server error. Try again later.' });
	}

	if (data.avatar_url) {
		return {
			profile: {
				name: data.name,
				whatsapp: data.whatsapp,
				avatar_url: supabase.storage.from('images').getPublicUrl(data.avatar_url).data.publicUrl
			}
		};
	}

	return {
		profile: data,
		session
	};
}

interface Update {
	name?: string;
	whatsapp?: string;
	avatar_url?: string;
}

export const actions: Actions = {
	update: async ({ request, locals: { supabase, getSession } }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const whatsapp = formData.get('whatsapp') as string;
		const avatar_url = formData.get('avatar_url') as string | undefined;

		if (!name.trim()) {
			return fail(400, { error: 'Name cannot be empty.' });
		}

		const session = await getSession();

		if (!session) {
			return fail(401, { error: 'Not authenticated.' });
		}

		const update: Update = {
			name,
			whatsapp
		};

		if (avatar_url) {
			update.avatar_url = avatar_url;
		}

		const { error } = await supabase.from('profiles').update(update).eq('id', session.user.id);

		if (error) {
			return fail(500, { error: 'Server error. Try again later.' });
		}

		return {
			message: 'Profile updated successfully.'
		};
	}
};
