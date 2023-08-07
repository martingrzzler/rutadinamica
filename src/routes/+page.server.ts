import { supabase } from '$lib/db';

export async function load() {
	const { data } = await supabase.from('mountains').select('id, name, slug, cover_image_url');
	console.log(data);

	return {
		mountains: data ?? []
	};
}
