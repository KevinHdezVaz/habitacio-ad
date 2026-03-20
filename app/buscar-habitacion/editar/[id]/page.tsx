import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import FormularioEditarBusqueda from './FormularioEditarBusqueda'

export default async function EditarPerfilBusquedaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/perfil')

  const { data: perfil } = await supabase
    .from('perfiles_inquilino')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!perfil) notFound()

  return (
    <div className="max-w-xl mx-auto py-6">
      <FormularioEditarBusqueda perfil={perfil} />
    </div>
  )
}
