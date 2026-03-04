import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export function getSupabaseClient() {
  if (!client) {
    if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase environment variables')
    }
    
    client = createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)
  }
  return client
}
