import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import FormularioPublicar from './components/FormularioPublicar'

export default async function PublicarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/publicar')

  // Verificar si el usuario tiene teléfono en su perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('telefono')
    .eq('id', user.id)
    .single()

  const hasPhone = !!(profile?.telefono?.trim())

  return <FormularioPublicar hasPhone={hasPhone} />
}
