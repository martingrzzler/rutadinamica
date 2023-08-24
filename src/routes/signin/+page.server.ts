import { fail, type Actions, redirect } from '@sveltejs/kit';

export async function load({ locals: { getSession } }) {
	const session = await getSession();

	if (session) {
		throw redirect(303, '/profile');
	}

	return {};
}

export const actions: Actions = {
	default: async ({ request, url, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;

		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${url.origin}/auth/callback`
			}
		});

		if (error) {
			return fail(500, { error: error.message, success: false, email });
		}

		return {
			success: true
		};
	}
};
