import { getSupabaseClient } from './client'
import type { User, Session } from '@supabase/supabase-js'
import { writable } from 'svelte/store'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
}

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    user: null,
    session: null,
    loading: true
  })

  return {
    subscribe,
    
    async initialize() {
      try {
        const supabase = getSupabaseClient()
        const { data: { session } } = await supabase.auth.getSession()
        
        set({
          user: session?.user ?? null,
          session,
          loading: false
        })

        supabase.auth.onAuthStateChange((_event, session) => {
          update(state => ({
            ...state,
            user: session?.user ?? null,
            session,
            loading: false
          }))
        })
      } catch (error) {
        console.error('Auth init error:', error)
        set({ user: null, session: null, loading: false })
      }
    },

    async signInAnonymously() {
      update(state => ({ ...state, loading: true }))
      
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase.auth.signInAnonymously()
        
        if (error) {
          update(state => ({ ...state, loading: false }))
          throw error
        }
        
        return data
      } catch (error) {
        update(state => ({ ...state, loading: false }))
        throw error
      }
    },

    async signOut() {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      set({
        user: null,
        session: null,
        loading: false
      })
    }
  }
}

export const auth = createAuthStore()
