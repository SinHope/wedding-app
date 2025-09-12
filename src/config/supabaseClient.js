import { createClient } from '@supabase/supabase-js'
// const supabaseUrl = 'https://jhbknobdqwcfdxvfnxgb.supabase.co'

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY

const supabase = createClient(supabaseUrl, supabaseKey, {db: { schema: 'manganui' }})

export default supabase