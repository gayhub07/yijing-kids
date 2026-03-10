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
          created_at: string
          updated_at: string
          name: string
          avatar: string
          age: number
          level: 'beginner' | 'explorer' | 'advanced'
          streak_days: number
          last_check_in: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          name?: string
          avatar?: string
          age?: number
          level?: 'beginner' | 'explorer' | 'advanced'
          streak_days?: number
          last_check_in?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          avatar?: string
          age?: number
          level?: 'beginner' | 'explorer' | 'advanced'
          streak_days?: number
          last_check_in?: string | null
        }
      }
      bagua_progress: {
        Row: {
          id: number
          user_id: string
          gua_name: string
          learned: boolean
          learned_at: string | null
        }
        Insert: {
          id?: number
          user_id: string
          gua_name: string
          learned?: boolean
          learned_at?: string | null
        }
        Update: {
          id?: number
          user_id?: string
          gua_name?: string
          learned?: boolean
          learned_at?: string | null
        }
      }
      story_progress: {
        Row: {
          id: number
          user_id: string
          story_id: number
          gua_name: string
          read: boolean
          read_at: string | null
        }
        Insert: {
          id?: number
          user_id: string
          story_id: number
          gua_name: string
          read?: boolean
          read_at?: string | null
        }
        Update: {
          id?: number
          user_id?: string
          story_id?: number
          gua_name?: string
          read?: boolean
          read_at?: string | null
        }
      }
      divination_history: {
        Row: {
          id: number
          user_id: string
          gua_name: string
          result: string
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          gua_name: string
          result: string
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          gua_name?: string
          result?: string
          created_at?: string
        }
      }
      achievements: {
        Row: {
          id: number
          user_id: string
          achievement_id: string
          unlocked_at: string
        }
        Insert: {
          id?: number
          user_id: string
          achievement_id: string
          unlocked_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          achievement_id?: string
          unlocked_at?: string
        }
      }
      daily_signins: {
        Row: {
          id: string
          user_id: string
          signin_date: string
          points: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          signin_date?: string
          points?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          signin_date?: string
          points?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_total_points: {
        Args: {
          user_id: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
