import { createClient } from '@supabase/supabase-js'

// Get the URL and Key from our environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create the connection to Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// This is like creating a phone line to talk to Supabase
// We can now use 'supabase' anywhere in our app to:
// - Sign up users
// - Log in users  
// - Store and retrieve data