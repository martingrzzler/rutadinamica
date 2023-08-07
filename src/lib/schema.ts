export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			mountains: {
				Row: {
					cover_image_url: string;
					created_at: string;
					id: number;
					name: string;
					slug: string;
					updated_at: string;
				};
				Insert: {
					cover_image_url: string;
					created_at?: string;
					id?: number;
					name: string;
					slug: string;
					updated_at?: string;
				};
				Update: {
					cover_image_url?: string;
					created_at?: string;
					id?: number;
					name?: string;
					slug?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
