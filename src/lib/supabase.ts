import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// The extra configuration block below is the magic key for Zrok
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      'skip_zrok_interstitial': 'true'
    }
  }
})