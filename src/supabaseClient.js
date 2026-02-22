import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,        // Behold sesjonen mellom besøk
    storageKey: 'familie-app',   // Unik nøkkel i localStorage
    autoRefreshToken: true,      // Forny token automatisk
    detectSessionInUrl: false    // Ikke bruk URL for innlogging (vi bruker OTP)
  }
})
