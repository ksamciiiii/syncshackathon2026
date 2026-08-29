import { createClient } from '@supabase/supabase-js'

// Anon/public key — safe to ship in client code, access is governed by
// Row Level Security policies (see supabase/schema.sql + migration_02_realtime.sql).
export const supabase = createClient(
  'https://nnchuhfoxgntoeoxljbs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uY2h1aGZveGdudG9lb3hsamJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5ODE4MDIsImV4cCI6MjEwMzU1NzgwMn0.RsoSiy6Jze7Ro-g8my9uzRzg2rfhWkwf1oLPCwHxU90'
)
