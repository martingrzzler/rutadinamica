import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { initialize } from '$lib/initTimeago.js';
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';
import { error } from '@sveltejs/kit';

export const load = async ({ fetch, data }) => {
	initialize();

	const supabase = createSupabaseLoadClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event: { fetch },
		serverSession: data.session
	});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	if (session) {
		const { data: profile, error: err } = await supabase
			.from('profiles')
			.select('avatar_url')
			.eq('id', session.user.id)
			.single();

		if (err) {
			throw error(500, err.message);
		}

		return {
			profile: {
				avatar_url: supabase.storage.from('images').getPublicUrl(profile.avatar_url).data.publicUrl
			},
			session,
			supabase
		};
	}

	return { supabase, session };
};
