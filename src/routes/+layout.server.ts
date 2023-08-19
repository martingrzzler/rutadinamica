import { error } from '@sveltejs/kit';

export async function load({ locals }) {
	const session = await locals.getSession();

	if (session) {
		const { data: profile, error: err } = await locals.supabase
			.from('profiles')
			.select('avatar_url')
			.eq('id', session.user.id)
			.single();

		if (err) {
			throw error(500, err.message);
		}

		return {
			session,
			profile: {
				avatar_url: locals.supabase.storage.from('images').getPublicUrl(profile.avatar_url).data
					.publicUrl
			}
		};
	}

	return {
		session
	};
}
