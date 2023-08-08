export async function load({ locals: { supabase } }) {
	const { data } = await supabase.from('mountains').select('id, name, slug, cover_image_url');

	return {
		mountains: data ?? []
	};
}
