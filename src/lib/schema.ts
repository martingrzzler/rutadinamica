export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      mountains: {
        Row: {
          cover_image_url: string
          created_at: string
          id: number
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          cover_image_url: string
          created_at?: string
          id?: number
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          cover_image_url?: string
          created_at?: string
          id?: number
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          content: string
          created_at: string
          id: number
          mountain_id: number
          profile_id: string
          route: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          mountain_id: number
          profile_id: string
          route: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          mountain_id?: number
          profile_id?: string
          route?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_mountain_id_fkey"
            columns: ["mountain_id"]
            referencedRelation: "mountains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
