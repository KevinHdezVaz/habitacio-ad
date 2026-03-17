import { createClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase con service role key.
 * Solo usar en Server Actions y Route Handlers — nunca en el cliente.
 * Requiere SUPABASE_SERVICE_ROLE_KEY en las variables de entorno.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
