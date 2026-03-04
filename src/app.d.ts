/// <reference types="@sveltejs/kit" />

declare global {
  namespace App {
    interface Error {
      message: string
      code?: string
    }
    interface Locals {
      supabase: import('@supabase/supabase-js').SupabaseClient<
        import('./lib/supabase/database.types').Database
      >
      safeGetSession: () => Promise<
        import('@supabase/supabase-js').Session | null
      >
    }
    interface PageData {}
    interface PageState {}
    interface Platform {}
  }
}

export {}
