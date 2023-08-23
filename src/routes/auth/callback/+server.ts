import { redirect } from '@sveltejs/kit';

export const GET = async ({ url, locals: { supabase, getSession } }) => {
	const code = url.searchParams.get('code');

	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (error) {
			console.error('Error exhaning code for session', error);
			throw redirect(303, '/signin');
		}
	}

	const session = await getSession();

	if (!session) {
		throw redirect(303, '/signin');
	}

	const { data } = await supabase
		.from('profiles')
		.select('name')
		.eq('id', session.user.id)
		.single();

	if (data?.name) {
		throw redirect(303, '/');
	} else {
		throw redirect(303, '/profile');
	}
};
