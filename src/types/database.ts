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
            profiles: {
                Row: {
                    id: string
                    role: 'user' | 'agent' | 'admin'
                    subscription_tier: 'basic' | 'vip'
                    full_name: string | null
                    avatar_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    role?: 'user' | 'agent' | 'admin'
                    subscription_tier?: 'basic' | 'vip'
                    full_name?: string | null
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    role?: 'user' | 'agent' | 'admin'
                    subscription_tier?: 'basic' | 'vip'
                    full_name?: string | null
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            events: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    date_time: string
                    location_name: string
                    location_coords: Json | null
                    image_url: string | null
                    created_by: string
                    status: 'pending' | 'approved' | 'rejected'
                    min_tier_required: 'basic' | 'vip'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    date_time: string
                    location_name: string
                    location_coords?: Json | null
                    image_url?: string | null
                    created_by: string
                    status?: 'pending' | 'approved' | 'rejected'
                    min_tier_required?: 'basic' | 'vip'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    date_time?: string
                    location_name?: string
                    location_coords?: Json | null
                    image_url?: string | null
                    created_by?: string
                    status?: 'pending' | 'approved' | 'rejected'
                    min_tier_required?: 'basic' | 'vip'
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}
