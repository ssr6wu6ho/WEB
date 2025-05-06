import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://kjpjvvbjlhopkmxoocsg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqcGp2dmJqbGhvcGtteG9vY3NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODQ0MjAsImV4cCI6MjA1NTk2MDQyMH0.9aWpKGYYePbLOQ1DOkspA1vaonzAGjPnBB68k6z0NY0'

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;